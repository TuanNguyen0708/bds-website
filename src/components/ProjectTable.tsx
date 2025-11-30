"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  Calendar,
  DollarSign,
  Search
} from "lucide-react";
import { getProjects, ProjectData, ProjectFilterOptions } from "@/lib/projectService";
import ProjectDetailDialog from "./ProjectDetailDialog";
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
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

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
    setSelectedProject(project);
    setIsDetailDialogOpen(true);
  };

  const closeDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedProject(null);
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

      {/* Projects Table */}
      {!loading && !error && (
        <Card>
          <CardContent className="pt-6">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy dự án nào
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Tên dự án</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Vị trí</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Chủ đầu tư</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Giá</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{project.projectName}</div>
                            {project.slogan && (
                              <div className="text-sm text-gray-500 mt-1">{project.slogan.substring(0, 50)}...</div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-gray-900">{project.location.district || project.location.city}</div>
                              <div className="text-gray-500 text-xs">{project.location.address.substring(0, 30)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Building className="h-4 w-4 text-gray-400" />
                            <div className="text-gray-700">{project.investor.substring(0, 30)}...</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={project.legalStatus === "Đang mở bán" ? "default" : "secondary"}>
                            {project.legalStatus}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <div className="text-gray-700">{project.pricing.pricePerSqm || "N/A"}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProject(project)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            Xem chi tiết
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
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

      {/* Project Detail Dialog */}
      <ProjectDetailDialog
        project={selectedProject}
        isOpen={isDetailDialogOpen}
        onClose={closeDetailDialog}
      />
    </div>
  );
};

export default ProjectTable;

