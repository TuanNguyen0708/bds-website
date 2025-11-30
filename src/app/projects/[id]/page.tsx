import ProjectDetailContent from './ProjectDetailContent';
import { getAllProjectIds } from '@/lib/projectService';
import fs from 'fs';
import path from 'path';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  try {
    // Try to read from JSON file first (faster and more reliable for static export)
    const idsFilePath = path.join(process.cwd(), 'assets', 'project-ids.json');
    if (fs.existsSync(idsFilePath)) {
      const fileContent = fs.readFileSync(idsFilePath, 'utf-8');
      const projectIds = JSON.parse(fileContent);
      return projectIds.map((p: { id: string }) => ({ id: p.id }));
    }
  } catch (error) {
    console.warn('Could not read project-ids.json, trying Firebase...', error);
  }

  try {
    // Fallback: Fetch from Firebase via projectService
    const params = await getAllProjectIds();
    return params;
  } catch (error) {
    console.error('Error fetching project IDs for static generation:', error);
    // Return empty array if both methods fail
    return [];
  }
}

export default function ProjectDetailPage() {
  return <ProjectDetailContent />;
}

