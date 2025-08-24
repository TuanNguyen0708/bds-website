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
import { ContactData } from "@/lib/contactService";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  Building
} from "lucide-react";

interface ContactDetailDialogProps {
  contact: ContactData | null;
  isOpen: boolean;
  onClose: () => void;
}

const ContactDetailDialog = ({ contact, isOpen, onClose }: ContactDetailDialogProps) => {
  if (!contact) return null;

  const formatDate = (date: unknown) => {
    if (!date) return "N/A";
    try {
      if (date instanceof Date) {
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
      }
      if (typeof date === 'object' && 'toDate' in date) {
        // Firestore Timestamp
        const jsDate = (date as { toDate: () => Date }).toDate();
        return jsDate.toLocaleDateString('vi-VN') + ' ' + jsDate.toLocaleTimeString('vi-VN');
      }
      return "N/A";
    } catch {
      return "N/A";
    }
  };

  const formatService = (service: string) => {
    const serviceLabels: Record<string, string> = {
      brokerage: "Môi giới Bất động sản",
      investment: "Đầu tư Bất động sản",
      legal: "Tư vấn Pháp lý",
      management: "Quản lý Bất động sản",
      other: "Khác"
    };
    return serviceLabels[service] || service;
  };

  const handleCallPhone = () => {
    window.open(`tel:${contact.phone}`, '_self');
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Phản hồi liên hệ từ ${contact.name}`);
    const body = encodeURIComponent(`Xin chào ${contact.name},\n\nCảm ơn bạn đã liên hệ với chúng tôi.\n\nTrân trọng,\nPhu Nguyen Land`);
    window.open(`mailto:${contact.email}?subject=${subject}&body=${body}`, '_self');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div>
            <DialogTitle className="text-2xl">Chi tiết liên hệ</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết từ khách hàng
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                <Badge variant="secondary" className="mt-1">
                  {formatService(contact.service)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{contact.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Số điện thoại</p>
                  <p className="text-sm text-gray-600">{contact.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Ngày liên hệ</p>
                  <p className="text-sm text-gray-600">{formatDate(contact.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Dịch vụ quan tâm</p>
                  <p className="text-sm text-gray-600">{formatService(contact.service)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-500" />
              <h4 className="text-lg font-medium text-gray-900">Nội dung tin nhắn</h4>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              {contact.message ? (
                <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
              ) : (
                <p className="text-gray-500 italic">Khách hàng không để lại nội dung tin nhắn</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1" onClick={handleSendEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Gửi email phản hồi
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleCallPhone}>
              <Phone className="h-4 w-4 mr-2" />
              Gọi điện thoại
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDetailDialog;
