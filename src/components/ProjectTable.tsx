"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye,
  MapPin,
  Building,
  DollarSign,
  Search
} from "lucide-react";
import { getProjects, ProjectData, ProjectFilterOptions } from "@/lib/projectService";
import { Badge } from "@/components/ui/badge";

// Debounce hook
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ProjectTable = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Filter state
  const [filters, setFilters] = useState<ProjectFilterOptions>({
    city: "",
    district: "",
    investor: "",
    legalStatus: "",
    searchTerm: "",
    minPrice: undefined,
    maxPrice: undefined,
  });
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);

  // Debounce filters
  const debouncedFilters = useDebounce(filters, 500);

  // Memoize pagination options
  const paginationOptions = useMemo(() => ({
    page: currentPage,
    pageSize: pageSize,
  }), [currentPage, pageSize]);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getProjects(debouncedFilters, paginationOptions);
      setProjects(result.projects);
      setTotal(result.total);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters, paginationOptions]);

  // Fetch when filters or pagination change
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedFilters]);

  const handleFilterChange = (field: keyof ProjectFilterOptions, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      city: "",
      district: "",
      investor: "",
      legalStatus: "",
      searchTerm: "",
      minPrice: undefined,
      maxPrice: undefined,
    });
    setCurrentPage(1);
  };

  const handleViewProject = (project: ProjectData) => {
    router.push(`/projects/${project.id}`);
  };

  const totalPages = useMemo(() => Math.ceil(total / pageSize), [total, pageSize]);

  const paginationInfo = useMemo(() => ({
    start: ((currentPage - 1) * pageSize) + 1,
    end: Math.min(currentPage * pageSize, total),
    total
  }), [currentPage, pageSize, total]);

  // Get unique values for filters
  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    projects.forEach(p => {
      if (p.location.city) cities.add(p.location.city);
    });
    return Array.from(cities).sort();
  }, [projects]);

  const uniqueDistricts = useMemo(() => {
    const districts = new Set<string>();
    projects.forEach(p => {
      if (p.location.district) districts.add(p.location.district);
    });
    return Array.from(districts).sort();
  }, [projects]);

  const uniqueInvestors = useMemo(() => {
    const investors = new Set<string>();
    projects.forEach(p => {
      if (p.investor) investors.add(p.investor);
    });
    return Array.from(investors).sort();
  }, [projects]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Danh sách dự án ({total})
          </h2>
          <p className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages || 1}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </Button>
          
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            Xóa bộ lọc
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bộ lọc tìm kiếm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Tìm kiếm</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Tên dự án, slogan..."
                    value={filters.searchTerm || ""}
                    onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city-filter">Thành phố</Label>
                <Select
                  value={filters.city || "all"}
                  onValueChange={(value) => handleFilterChange("city", value === "all" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thành phố" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả thành phố</SelectItem>
                    {uniqueCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="district-filter">Quận/Huyện</Label>
                <Select
                  value={filters.district || "all"}
                  onValueChange={(value) => handleFilterChange("district", value === "all" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quận/huyện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả quận/huyện</SelectItem>
                    {uniqueDistricts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="legal-status-filter">Trạng thái</Label>
                <Select
                  value={filters.legalStatus || "all"}
                  onValueChange={(value) => handleFilterChange("legalStatus", value === "all" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="Đang mở bán">Đang mở bán</SelectItem>
                    <SelectItem value="Sắp mở bán">Sắp mở bán</SelectItem>
                    <SelectItem value="Đã bàn giao">Đã bàn giao</SelectItem>
                    <SelectItem value="Đang thi công">Đang thi công</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Đang tải dữ liệu...</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Card List */}
      {!loading && !error && (
        <>
          {projects.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-gray-500">
                  Không tìm thấy dự án nào
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card 
                  key={project.id} 
                  className="hover:shadow-lg transition-shadow duration-200 flex flex-col"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                          {project.projectName}
                        </CardTitle>
                        {project.slogan && (
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {project.slogan}
                          </p>
                        )}
                      </div>
                      <Badge 
                        variant={project.legalStatus === "Đang mở bán" ? "default" : "secondary"}
                        className="shrink-0"
                      >
                        {project.legalStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col gap-4">
                    {/* Location */}
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {project.location.district || project.location.city}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                          {project.location.address}
                        </div>
                      </div>
                    </div>

                    {/* Investor */}
                    <div className="flex items-start gap-2">
                      <Building className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                      <div className="text-sm text-gray-700 line-clamp-1">
                        {project.investor}
                      </div>
                    </div>

                    {/* Price */}
                    {project.pricing.pricePerSqm && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400 shrink-0" />
                        <div className="text-sm font-semibold text-gray-900">
                          {project.pricing.pricePerSqm}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-auto pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProject(project)}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {!loading && !error && projects.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Label className="text-sm">Hiển thị</Label>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => handlePageSizeChange(parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">dự án mỗi trang</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (page > totalPages) return null;
                
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasMore}
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            Hiển thị {paginationInfo.start} - {paginationInfo.end} trong tổng số {paginationInfo.total} kết quả
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTable;

