"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectData } from "@/lib/projectService";
import SalesPolicySection from "@/components/SalesPolicySection";
import { 
  MapPin, 
  Building, 
  Calendar, 
  DollarSign,
  Ruler,
  Home,
  Layers,
  Users,
  TreePine,
  Car,
  Palette,
  Wrench,
  FileText,
  Image as ImageIcon,
  Video,
  ExternalLink
} from "lucide-react";

interface ProjectDetailDialogProps {
  project: ProjectData | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailDialog = ({ project, isOpen, onClose }: ProjectDetailDialogProps) => {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.projectName}</DialogTitle>
          <DialogDescription>
            {project.slogan}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Tổng quan</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{project.summary.substring(0, 500)}...</p>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Vị trí</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Địa chỉ</p>
                <p className="text-sm text-gray-600">{project.location.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Quận/Huyện</p>
                <p className="text-sm text-gray-600">{project.location.district}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Thành phố</p>
                <p className="text-sm text-gray-600">{project.location.city}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Khu vực</p>
                <p className="text-sm text-gray-600">{project.location.region}</p>
              </div>
            </div>
            {project.location.surrounding && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Xung quanh</p>
                <p className="text-sm text-gray-600">{project.location.surrounding}</p>
              </div>
            )}
          </div>

          {/* Investor & Developers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Chủ đầu tư</h3>
              </div>
              <p className="text-sm text-gray-700">{project.investor}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Nhà phát triển</h3>
              </div>
              <div className="space-y-1">
                {project.developers.map((dev, idx) => (
                  <p key={idx} className="text-sm text-gray-700">• {dev}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Status & Timeline */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Trạng thái</p>
              <Badge variant={project.legalStatus === "Đang mở bán" ? "default" : "secondary"}>
                {project.legalStatus}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Hình thức sở hữu</p>
              <p className="text-sm text-gray-600">{project.ownership}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Khởi công</p>
              <p className="text-sm text-gray-600">{project.constructionStart || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Bàn giao</p>
              <p className="text-sm text-gray-600">{project.handoverTime || "N/A"}</p>
            </div>
          </div>

          {/* Scale */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Quy mô dự án
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.scale.totalLandArea && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Tổng diện tích</p>
                  <p className="text-sm text-gray-600">{project.scale.totalLandArea}</p>
                </div>
              )}
              {project.scale.numberOfBlocks && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Số block</p>
                  <p className="text-sm text-gray-600">{project.scale.numberOfBlocks}</p>
                </div>
              )}
              {project.scale.numberOfFloors && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Số tầng</p>
                  <p className="text-sm text-gray-600">{project.scale.numberOfFloors}</p>
                </div>
              )}
              {project.scale.numberOfUnits && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Số căn hộ</p>
                  <p className="text-sm text-gray-600">{project.scale.numberOfUnits}</p>
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          {project.pricing.pricePerSqm && (
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Giá bán
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Giá/m²</p>
                  <p className="text-lg font-semibold text-green-600">{project.pricing.pricePerSqm}</p>
                </div>
                {project.pricing.priceRange && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Khoảng giá</p>
                    <p className="text-sm text-gray-600">{project.pricing.priceRange}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Unit Types */}
          {project.design.unitTypes && project.design.unitTypes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Home className="h-5 w-5" />
                Loại căn hộ
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {project.design.unitTypes.map((unit, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-sm">{unit.type}</p>
                    <p className="text-xs text-gray-600">{unit.area}</p>
                    {unit.description && (
                      <p className="text-xs text-gray-500 mt-1">{unit.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {(project.amenities.internal.length > 0 || project.amenities.external.length > 0) && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Tiện ích</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.amenities.internal.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Nội khu</p>
                    <div className="flex flex-wrap gap-2">
                      {project.amenities.internal.map((amenity, idx) => (
                        <Badge key={idx} variant="secondary">{amenity}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {project.amenities.external.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Ngoại khu</p>
                    <div className="flex flex-wrap gap-2">
                      {project.amenities.external.map((amenity, idx) => (
                        <Badge key={idx} variant="outline">{amenity}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Policies */}
          {project.policies.salesPolicy && (
            typeof project.policies.salesPolicy === 'object' && 
            'currency' in project.policies.salesPolicy ? (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Chính sách bán hàng
                </h3>
                <SalesPolicySection salesPolicy={project.policies.salesPolicy} compact={true} />
              </div>
            ) : (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Chính sách bán hàng
                </h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{project.policies.salesPolicy}</p>
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailDialog;

