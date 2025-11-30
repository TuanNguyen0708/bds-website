param(
    [string]$AssetsRoot = "assets",
    [string]$OutputPath = "assets/projects.json"
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

function Normalize-Text {
    param([string]$Value)

    if ($null -eq $Value) { return "" }

    return $Value.Normalize([System.Text.NormalizationForm]::FormC)
}

function Normalize-Comparable {
    param([string]$Value)

    if ($null -eq $Value) { return "" }

    $normalized = Normalize-Text $Value
    $formD = $normalized.Normalize([System.Text.NormalizationForm]::FormD)
    $builder = [System.Text.StringBuilder]::new()

    foreach ($ch in $formD.ToCharArray()) {
        $category = [System.Globalization.CharUnicodeInfo]::GetUnicodeCategory($ch)
        if ($category -ne [System.Globalization.UnicodeCategory]::NonSpacingMark) {
            [void]$builder.Append($ch)
        }
    }

    return $builder.ToString().ToLowerInvariant()
}

function Get-InlinePairs {
    param([string]$Text)

    if (-not $Text) { return @() }

    $regex = [regex]'(?<label>[^:\r\n]+?)\s*:\s*'
    $matches = $regex.Matches($Text)
    if ($matches.Count -eq 0) { return @() }

    $pairs = @()
    for ($i = 0; $i -lt $matches.Count; $i++) {
        $match = $matches[$i]
        $label = $match.Groups["label"].Value.Trim()
        if (-not $label) { continue }

        $valueStart = $match.Index + $match.Length
        $valueEnd = if ($i + 1 -lt $matches.Count) { $matches[$i + 1].Index } else { $Text.Length }
        if ($valueEnd -le $valueStart) { continue }

        $value = $Text.Substring($valueStart, $valueEnd - $valueStart).Trim()
        if (-not $value) { continue }

        $pairs += [pscustomobject]@{
            label = $label
            value = $value
        }
    }

    return $pairs
}

function Get-DocParagraphs {
    param([string]$DocxPath)

    $zip = [IO.Compression.ZipFile]::OpenRead($DocxPath)
    try {
        $entry = $zip.GetEntry("word/document.xml")
        if (-not $entry) {
            return @()
        }

        $reader = [System.IO.StreamReader]::new($entry.Open())
        try {
            $xml = $reader.ReadToEnd()
        }
        finally {
            $reader.Dispose()
        }
    }
    finally {
        $zip.Dispose()
    }

    $xmlDoc = [System.Xml.XmlDocument]::new()
    $xmlDoc.LoadXml($xml)

    $nsMgr = [System.Xml.XmlNamespaceManager]::new($xmlDoc.NameTable)
    $nsMgr.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main") | Out-Null

    $paragraphs = $xmlDoc.SelectNodes("//w:body/w:p", $nsMgr)
    $lines = [System.Collections.Generic.List[string]]::new()

    foreach ($p in $paragraphs) {
        $textNodes = $p.SelectNodes(".//w:t", $nsMgr)
        if (-not $textNodes -or $textNodes.Count -eq 0) {
            continue
        }

        $text = ($textNodes | ForEach-Object { $_.InnerText }) -join ''
        $text = $text.Replace([char]0x00A0, ' ').Trim()
        $text = Normalize-Text $text

        if ($text.Length -gt 0) {
            $lines.Add($text)
        }
    }

    return $lines
}

function Is-Heading {
    param([string]$Line)

    if (-not $Line) { return $false }

    $candidate = $Line.Trim()

    if ($candidate -match '^[IVXLCDM]+\s*/') { return $true }
    if ($candidate -match '^[0-9]+\s*[\.\)]\s*$') { return $true }
    if ($candidate -match '[:：]\s*$') { return $true }

    $normalizedCandidate = Normalize-Comparable $candidate
    $headingPatterns = @(
        'thong tin chi tiet', 'tong quan', 'vi tri', 'tien ich', 'mat bang', 
        'chinh sach', 'ho so', 'demo', 'lien he', 'ly do', 'chinh sach ban hang',
        'thiet ke', 'kien truc', 'chu dau tu', 'nha dau tu', 'dia chi', 
        'vi tri', 'tien ich', 'tien nghi', 'amenities', 'design', 'location', 
        'investor', 'policies', 'chinh sach', 'thanh toan', 'uu dai', 
        'khuyen mai', 'promotion', 'payment'
    )
    foreach ($pattern in $headingPatterns) {
        if ($normalizedCandidate -match "^$pattern") { return $true }
    }

    return $false
}

function Find-LineIndex {
    param(
        [System.Collections.Generic.List[string]]$Lines,
        [string]$Needle
    )

    if (-not $Needle) { return -1 }

    $target = Normalize-Comparable $Needle

    for ($idx = 0; $idx -lt $Lines.Count; $idx++) {
        $current = Normalize-Comparable $Lines[$idx]
        if ($current -eq $target) {
            return $idx
        }
    }

    return -1
}

function Get-DetailPairs {
    param(
        [System.Collections.Generic.List[string]]$Lines
    )

    $pairs = @()
    $count = $Lines.Count
    $startIndex = Find-LineIndex -Lines $Lines -Needle "Thong tin chi tiet"

    if ($startIndex -lt 0) {
        return [pscustomobject]@{ Pairs = @(); NextIndex = 1 }
    }

    $i = $startIndex + 1

    while ($i + 1 -le $count) {
        if ($i -ge $count) { break }

        $label = $Lines[$i].Trim()
        if (-not $label) {
            $i++
            continue
        }

        if (Is-Heading $label) { break }
        if ($i + 1 -ge $count) { break }

        $value = $Lines[$i + 1].Trim()
        if (-not $value) { break }
        if (Is-Heading $value) { break }

        $pairs += [pscustomobject]@{
            label = $label
            value = $value
        }

        $i += 2
    }

    $nextIndex = if ($pairs.Count -gt 0) { $i } else { $startIndex + 1 }

    return [pscustomobject]@{
        Pairs     = @($pairs)
        NextIndex = [Math]::Min($nextIndex, [Math]::Max($count - 1, 0))
    }
}

function Get-Media {
    param([System.Collections.Generic.List[string]]$Lines)

    $media = @()
    foreach ($line in $Lines) {
        if ($line -notmatch "INCLUDEPICTURE") { continue }

        $match = [regex]::Match($line, 'INCLUDEPICTURE\s+\"([^\"]+)\"')
        if ($match.Success) {
            $media += [pscustomobject]@{
                type = "image"
                url  = $match.Groups[1].Value
            }
        }
    }

    return $media
}

function Build-Sections {
    param(
        [System.Collections.Generic.List[string]]$Lines,
        [int]$StartIndex
    )

    $sections = @()
    $currentTitle = $null
    $currentParagraphs = [System.Collections.Generic.List[string]]::new()
    $currentFacts = @()

    $commitSection = {
        if (-not $currentTitle) { $currentTitle = "Nội dung" }
        if ($currentParagraphs.Count -eq 0 -and $currentFacts.Count -eq 0) {
            $currentParagraphs = [System.Collections.Generic.List[string]]::new()
            $currentFacts = @()
            return
        }

        $sections += [pscustomobject]@{
            title      = $currentTitle
            paragraphs = @($currentParagraphs)
            facts      = @($currentFacts)
        }

        $currentParagraphs = [System.Collections.Generic.List[string]]::new()
        $currentFacts = @()
    }

    for ($i = $StartIndex; $i -lt $Lines.Count; $i++) {
        $line = $Lines[$i].Trim()
        if (-not $line) { continue }
        if ($line -like "INCLUDEPICTURE*") { continue }

        if (Is-Heading $line) {
            if ($currentTitle -or $currentParagraphs.Count -gt 0 -or $currentFacts.Count -gt 0) {
                & $commitSection
            }

            $currentTitle = ($line -replace '[:：]\s*$', '').Trim()
            if (-not $currentTitle) { $currentTitle = "Nội dung" }
            continue
        }

        if (-not $currentTitle) { $currentTitle = "Nội dung" }

        $inlinePairs = Get-InlinePairs $line
        if ($inlinePairs.Count -gt 0) {
            $currentFacts += $inlinePairs
            continue
        }

        $currentParagraphs.Add($line)
    }

    if ($currentParagraphs.Count -gt 0 -or $currentFacts.Count -gt 0 -or $currentTitle) {
        & $commitSection
    }

    return @($sections | Where-Object { $_.paragraphs.Count -gt 0 -or $_.facts.Count -gt 0 })
}

function New-ProjectObject {
    param(
        [string]$FolderName,
        [string]$DocPath
    )

    $rawParagraphs = Get-DocParagraphs -DocxPath $DocPath
    if (-not $rawParagraphs -or $rawParagraphs.Count -eq 0) {
        return $null
    }

    $paragraphs = [System.Collections.Generic.List[string]]::new()
    foreach ($line in $rawParagraphs) {
        $trimmed = Normalize-Text ($line.Trim())
        if ($trimmed.Length -gt 0) {
            $paragraphs.Add($trimmed)
        }
    }

    if ($paragraphs.Count -eq 0) {
        return $null
    }

    $projectName = $paragraphs[0]
    $tagline = $null

    if ($paragraphs.Count -gt 1) {
        $secondLine = $paragraphs[1]
        $secondComparable = Normalize-Comparable $secondLine
        if (($secondComparable -ne "thong tin chi tiet") -and -not (Is-Heading $secondLine)) {
            $tagline = $secondLine
        }
    }

    $detailResult = Get-DetailPairs -Lines $paragraphs
    $sections = Build-Sections -Lines $paragraphs -StartIndex $detailResult.NextIndex
    $media = Get-Media -Lines $paragraphs

    # If no sections found, try to build from all content after details
    if ($sections.Count -eq 0 -and $paragraphs.Count -gt $detailResult.NextIndex) {
        # Create a default section with all remaining content
        $remainingContent = [System.Collections.Generic.List[string]]::new()
        for ($i = $detailResult.NextIndex; $i -lt $paragraphs.Count; $i++) {
            $line = $paragraphs[$i].Trim()
            if ($line -and $line -notlike "INCLUDEPICTURE*") {
                $remainingContent.Add($line)
            }
        }
        
        if ($remainingContent.Count -gt 0) {
            $sections = @([pscustomobject]@{
                title = "Nội dung"
                paragraphs = @($remainingContent)
                facts = @()
            })
        }
    }

    if (-not $tagline) {
        foreach ($section in $sections) {
            if ($section.paragraphs -and $section.paragraphs.Count -gt 0) {
                $tagline = $section.paragraphs[0]
                break
            }
        }
    }

    return [pscustomobject]@{
        key      = ($FolderName -replace '\s+', '-').ToLower()
        folder   = $FolderName
        file     = [System.IO.Path]::GetFileName($DocPath)
        name     = $projectName
        tagline  = $tagline
        details  = @($detailResult.Pairs)
        sections = @($sections)
        media    = @($media)
    }
}

$projects = @()

Get-ChildItem -Path $AssetsRoot -Directory | ForEach-Object {
    $docFile = Get-ChildItem -Path $_.FullName -Filter *.docx | Select-Object -First 1
    if (-not $docFile) { return }

    $project = New-ProjectObject -FolderName $_.Name -DocPath $docFile.FullName
    if ($project) {
        $projects += $project
    }
}

$projects | ConvertTo-Json -Depth 8 | Set-Content -Path $OutputPath -Encoding UTF8

Write-Host "Generated $($projects.Count) project entries at $OutputPath"

