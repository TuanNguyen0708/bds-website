"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, 
  MapPin, 
  Building, 
  DollarSign, 
  Ruler, 
  Home, 
  Users, 
  FileText,
  Calendar,
  Shield,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { getProjectById, ProjectData } from "@/lib/projectService";
import Link from "next/link";
import SalesPolicySection from "@/components/SalesPolicySection";

export default function ProjectDetailContent() {
  const params = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectId = params.id as string;
        const projectData = await getProjectById(projectId);
        
        if (!projectData) {
          setError("Không tìm thấy dự án");
          return;
        }
        
        setProject(projectData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 mt-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 text-lg font-medium">Đang tải thông tin dự án...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/projects">
              <Button variant="outline" size="sm" className="flex items-center gap-2 hover:bg-blue-50 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Về danh sách dự án
              </Button>
            </Link>
          </div>
          <Card className="p-8 text-center shadow-xl border-red-200 bg-white">
            <p className="text-red-600 text-lg font-medium">{error || "Không tìm thấy dự án"}</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/projects">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 hover:bg-white hover:shadow-md transition-all duration-200 border-gray-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Về danh sách dự án
            </Button>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="relative p-8 md:p-12 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-6 w-6 text-yellow-300" />
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {project.legalStatus}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">{project.projectName}</h1>
            <p className="text-xl md:text-2xl text-blue-100 font-light mb-6">{project.slogan}</p>
            
            {/* Thông tin chi tiết */}
            <div className="mt-6 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Thông tin chi tiết</h3>
              <div className="space-y-3">
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-3 border-b border-dotted border-gray-300">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                    <p className="text-base font-semibold text-gray-800">{project.legalStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Giá</p>
                    <p className="text-base font-semibold text-gray-800">
                      {project.pricing.pricePerSqm || project.pricing.priceRange || "Liên hệ"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Thời gian xây dựng</p>
                    <p className="text-base font-semibold text-gray-800">{project.constructionStart || "N/A"}</p>
                  </div>
                </div>
                
                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-3 border-b border-dotted border-gray-300">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Thời gian giao nhà</p>
                    <p className="text-base font-semibold text-gray-800">{project.handoverTime || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Số block</p>
                    <p className="text-base font-semibold text-gray-800">{project.scale.numberOfBlocks || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Số tầng</p>
                    <p className="text-base font-semibold text-gray-800">{project.scale.numberOfFloors || "N/A"}</p>
                  </div>
                </div>
                
                {/* Row 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Số căn hộ</p>
                    <p className="text-base font-semibold text-gray-800">{project.scale.numberOfUnits || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Diện tích căn hộ</p>
                    <p className="text-base font-semibold text-gray-800">
                      {(() => {
                        if (!project.design.unitTypes || project.design.unitTypes.length === 0) {
                          return "N/A";
                        }
                        // Extract numbers from area strings (e.g., "34m2" -> 34)
                        const areas = project.design.unitTypes
                          .map(unit => {
                            const match = unit.area.match(/(\d+(?:\.\d+)?)/);
                            return match ? parseFloat(match[1]) : null;
                          })
                          .filter((area): area is number => area !== null);
                        
                        if (areas.length === 0) {
                          return project.design.unitTypes.map(unit => unit.area).join(", ");
                        }
                        
                        const min = Math.min(...areas);
                        const max = Math.max(...areas);
                        return min === max ? `${min}m²` : `${min}-${max}m²`;
                      })()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Hình thức sở hữu</p>
                    <p className="text-base font-semibold text-gray-800">{project.ownership}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Overview Card */}
          <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Tổng quan dự án</h2>
            </div>
            <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-xl p-6 md:p-8 border-l-4 border-blue-500">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base md:text-lg font-normal">
                {project.summary.split(/\n\s*\n/).map((paragraph, idx) => 
                  paragraph.trim() ? (
                    <p key={idx} className="mb-5 last:mb-0 text-justify">
                      {paragraph.trim()}
                    </p>
                  ) : null
                )}
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5" />
                <p className="text-sm font-medium opacity-90">Trạng thái</p>
              </div>
              <p className="text-xl font-bold">{project.legalStatus}</p>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5" />
                <p className="text-sm font-medium opacity-90">Sở hữu</p>
              </div>
              <p className="text-lg font-bold">{project.ownership}</p>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-5 w-5" />
                <p className="text-sm font-medium opacity-90">Khởi công</p>
              </div>
              <p className="text-lg font-bold">{project.constructionStart || "N/A"}</p>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5" />
                <p className="text-sm font-medium opacity-90">Bàn giao</p>
              </div>
              <p className="text-lg font-bold">{project.handoverTime || "N/A"}</p>
            </Card>
          </div>

          {/* Location Card */}
          <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Vị trí dự án</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 h-full flex flex-col">
                <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Địa chỉ</p>
                <p className="text-base text-gray-900 font-medium flex-grow">{project.location.address}</p>
              </div>
              <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 h-full flex flex-col">
                <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Quận/Huyện</p>
                <p className="text-base text-gray-900 font-medium flex-grow">{project.location.district}</p>
              </div>
              <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 h-full flex flex-col">
                <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Thành phố</p>
                <p className="text-base text-gray-900 font-medium flex-grow">{project.location.city}</p>
              </div>
              <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 h-full flex flex-col">
                <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Khu vực</p>
                <p className="text-base text-gray-900 font-medium flex-grow">{project.location.region}</p>
              </div>
            </div>
            {project.location.surrounding && (
              <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
                <p className="text-sm font-semibold text-gray-700 mb-2">Xung quanh dự án</p>
                <p className="text-base text-gray-700 leading-relaxed">{project.location.surrounding}</p>
              </div>
            )}
          </Card>

          {/* Investor & Developers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Chủ đầu tư</h3>
              </div>
              <p className="text-lg text-gray-700 font-medium">{project.investor}</p>
            </Card>
            <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Nhà phát triển</h3>
              </div>
              <div className="space-y-2">
                {project.developers.map((dev, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <p className="text-lg text-gray-700 font-medium">{dev}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Scale Card */}
          <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Ruler className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800">Quy mô dự án</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.scale.totalLandArea && (
                <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Tổng diện tích</p>
                  <p className="text-xl font-bold text-blue-700">{project.scale.totalLandArea}</p>
                </div>
              )}
              {project.scale.numberOfBlocks && (
                <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-lg transition-shadow">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Số block</p>
                  <p className="text-xl font-bold text-green-700">{project.scale.numberOfBlocks}</p>
                </div>
              )}
              {project.scale.numberOfFloors && (
                <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-lg transition-shadow">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Số tầng</p>
                  <p className="text-xl font-bold text-purple-700">{project.scale.numberOfFloors}</p>
                </div>
              )}
              {project.scale.numberOfUnits && (
                <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-lg transition-shadow">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Số căn hộ</p>
                  <p className="text-xl font-bold text-orange-700">{project.scale.numberOfUnits}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Pricing Card */}
          {project.pricing.pricePerSqm && (
            <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">Giá bán</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-xl shadow-lg border-2 border-green-200">
                  <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Giá/m²</p>
                  <p className="text-3xl font-bold text-green-600">{project.pricing.pricePerSqm}</p>
                </div>
                {project.pricing.priceRange && (
                  <div className="p-6 bg-white rounded-xl shadow-lg border-2 border-green-200">
                    <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Khoảng giá</p>
                    <p className="text-2xl font-bold text-gray-800">{project.pricing.priceRange}</p>
                  </div>
                )}
                {project.pricing.startingPrice && (
                  <div className="p-6 bg-white rounded-xl shadow-lg border-2 border-green-200">
                    <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Giá khởi điểm</p>
                    <p className="text-2xl font-bold text-gray-800">{project.pricing.startingPrice}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Unit Types */}
          {project.design.unitTypes && project.design.unitTypes.length > 0 && (
            <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">Loại căn hộ</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {project.design.unitTypes.map((unit, idx) => (
                  <div 
                    key={idx} 
                    className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 group"
                  >
                    <p className="font-bold text-lg text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                      {unit.type}
                    </p>
                    <p className="text-base text-gray-600 mb-3 font-medium">{unit.area}</p>
                    {unit.description && (
                      <p className="text-sm text-gray-500 leading-relaxed">{unit.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Amenities */}
          {(project.amenities.internal.length > 0 || project.amenities.external.length > 0) && (
            <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">Tiện ích</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.amenities.internal.length > 0 && (
                  <div>
                    <div className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Tiện ích nội khu
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {project.amenities.internal.map((amenity, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary" 
                          className="text-sm py-2 px-4 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 hover:shadow-md transition-shadow"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {project.amenities.external.length > 0 && (
                  <div>
                    <div className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Tiện ích ngoại khu
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {project.amenities.external.map((amenity, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline" 
                          className="text-sm py-2 px-4 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-2 border-green-200 hover:shadow-md transition-shadow"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Policies */}
          {project.policies.salesPolicy && (
            typeof project.policies.salesPolicy === 'object' && 
            'currency' in project.policies.salesPolicy ? (
              <SalesPolicySection salesPolicy={project.policies.salesPolicy} />
            ) : (
              <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">Chính sách bán hàng</h3>
                </div>
                <div className="p-6 bg-white rounded-xl border-l-4 border-blue-500 shadow-md">
                  <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {project.policies.salesPolicy}
                  </p>
                </div>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}

