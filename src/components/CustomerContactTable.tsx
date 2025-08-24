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
  Mail,
  Phone,
  Calendar,
  User
} from "lucide-react";
import { getContacts, ContactData, FilterOptions } from "@/lib/contactService";
import ContactDetailDialog from "./ContactDetailDialog";

// Debounce hook để tránh gọi API quá nhiều
const useDebounce = (value: FilterOptions, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<FilterOptions>(value);

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

const CustomerContactTable = () => {
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    name: "",
    service: "",
    startDate: undefined,
    endDate: undefined,
  });
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactData | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Debounce filters để tránh gọi API quá nhiều
  const debouncedFilters = useDebounce(filters, 500);

  const serviceOptions = [
    { value: "all", label: "Tất cả dịch vụ" },
    { value: "brokerage", label: "Môi giới Bất động sản" },
    { value: "investment", label: "Đầu tư Bất động sản" },
    { value: "legal", label: "Tư vấn Pháp lý" },
    { value: "management", label: "Quản lý Bất động sản" },
    { value: "other", label: "Khác" },
  ];

  // Memoize pagination options để tránh re-render không cần thiết
  const paginationOptions = useMemo(() => ({
    page: currentPage,
    pageSize: pageSize,
  }), [currentPage, pageSize]);

  // Tối ưu fetchContacts với useCallback
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getContacts(debouncedFilters, paginationOptions);
      setContacts(result.contacts);
      setTotal(result.total);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters, paginationOptions]);

  // Chỉ fetch khi filters hoặc pagination thay đổi
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Reset về trang 1 khi filters thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedFilters]);

  const handleFilterChange = (field: keyof FilterOptions, value: string | Date | undefined) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi page size
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      service: "",
      startDate: undefined,
      endDate: undefined,
    });
    setCurrentPage(1);
  };

  const handleViewContact = (contact: ContactData) => {
    setSelectedContact(contact);
    setIsDetailDialogOpen(true);
  };

  const closeDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedContact(null);
  };

  const formatDate = (date: unknown) => {
    if (!date) return "N/A";
    try {
      if (date instanceof Date) {
        return date.toLocaleDateString('vi-VN');
      }
      if (typeof date === 'object' && 'toDate' in date) {
        return (date as { toDate: () => Date }).toDate().toLocaleDateString('vi-VN');
      }
      return "N/A";
    } catch {
      return "N/A";
    }
  };

  const formatService = (service: string) => {
    const option = serviceOptions.find(opt => opt.value === service);
    return option ? option.label : service;
  };

  // Memoize totalPages để tránh tính toán lại
  const totalPages = useMemo(() => Math.ceil(total / pageSize), [total, pageSize]);

  // Memoize pagination info để tránh re-render
  const paginationInfo = useMemo(() => ({
    start: ((currentPage - 1) * pageSize) + 1,
    end: Math.min(currentPage * pageSize, total),
    total
  }), [currentPage, pageSize, total]);

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Danh sách liên hệ ({total})
          </h2>
          <p className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages}
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
                <Label htmlFor="name-filter">Tên khách hàng</Label>
                <Input
                  id="name-filter"
                  placeholder="Nhập tên để tìm kiếm..."
                  value={filters.name || ""}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service-filter">Dịch vụ</Label>
                <Select
                  value={filters.service || "all"}
                  onValueChange={(value) => handleFilterChange("service", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn dịch vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="start-date">Từ ngày</Label>
                <Input
                  id="start-date"
                  type="date"
                  onChange={(e) => handleFilterChange("startDate", e.target.value ? new Date(e.target.value) : undefined)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-date">Đến ngày</Label>
                <Input
                  id="end-date"
                  type="date"
                  onChange={(e) => handleFilterChange("endDate", e.target.value ? new Date(e.target.value) : undefined)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchContacts} className="mt-2">Thử lại</Button>
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Không có dữ liệu liên hệ nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dịch vụ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày liên hệ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nội dung
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {contact.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {formatService(contact.service)}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(contact.createdAt)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {contact.message || "Không có nội dung"}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-2"
                          onClick={() => handleViewContact(contact)}
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

      {/* Pagination */}
      {!loading && !error && contacts.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="page-size">Hiển thị:</Label>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => handlePageSizeChange(parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">dòng mỗi trang</span>
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

      {/* Contact Detail Dialog */}
      <ContactDetailDialog
        contact={selectedContact}
        isOpen={isDetailDialogOpen}
        onClose={closeDetailDialog}
      />
    </div>
  );
};

export default CustomerContactTable;
