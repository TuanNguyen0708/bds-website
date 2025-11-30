"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, DollarSign, Percent, Gift, Calendar, Info } from "lucide-react";

interface SalesPolicy {
  currency: string;
  pricing: Array<{
    unit_type: string;
    area_m2: number | string;
    price_min_billion: number;
    price_max_billion: number;
    price_min_vnd: number;
    price_max_vnd: number;
  }>;
  promotions: {
    loan_support: Array<{
      description: string;
      amount_percent: number;
      valid_until: string;
    }>;
    discounts: Array<{
      name: string;
      percent: number;
      condition: string;
    }>;
    free_management_months: number | null;
    extra_discounts: Array<{
      name: string;
      percent: number;
      condition: string;
    }>;
  };
  notes: {
    currency_note: string;
    date_format: string;
    assumptions: string;
  };
}

interface SalesPolicySectionProps {
  salesPolicy: SalesPolicy;
  compact?: boolean;
}

const formatPrice = (price: number): string => {
  if (price >= 1000000000) {
    return `${(price / 1000000000).toFixed(2)} tỷ`;
  }
  return `${(price / 1000000).toFixed(0)} triệu`;
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  } catch {
    return dateString;
  }
};

export default function SalesPolicySection({ salesPolicy, compact = false }: SalesPolicySectionProps) {
  const { currency, pricing, promotions, notes } = salesPolicy;

  const titleClass = compact ? "text-xl" : "text-3xl";
  const paddingClass = compact ? "p-3" : "p-6";
  const spacingClass = compact ? "space-y-3" : "space-y-6";

  const content = (
    <div className={spacingClass}>
        {/* Pricing Table */}
        {pricing && pricing.length > 0 && (
          <div className={`bg-white rounded-xl ${paddingClass} shadow-lg border-2 border-blue-200`}>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h4 className={compact ? "text-lg font-bold text-gray-800" : "text-xl font-bold text-gray-800"}>Bảng giá căn hộ</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 to-indigo-100">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Loại căn</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Diện tích (m²)</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Giá (tỷ VND)</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Giá (VND)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pricing.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.unit_type}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.area_m2}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900 font-semibold">
                        {item.price_min_billion === item.price_max_billion
                          ? `${item.price_min_billion} tỷ`
                          : `${item.price_min_billion} - ${item.price_max_billion} tỷ`}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">
                        {formatPrice(item.price_min_vnd)} - {formatPrice(item.price_max_vnd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Promotions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Loan Support */}
          {promotions.loan_support && promotions.loan_support.length > 0 && (
            <div className={`bg-white rounded-xl ${paddingClass} shadow-lg border-2 border-green-200`}>
              <div className="flex items-center gap-2 mb-4">
                <Percent className="h-5 w-5 text-green-600" />
                <h4 className={compact ? "text-lg font-bold text-gray-800" : "text-xl font-bold text-gray-800"}>Hỗ trợ vay</h4>
              </div>
              <div className="space-y-3">
                {promotions.loan_support.map((support, idx) => (
                  <div key={idx} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">{support.description}</p>
                      <Badge className="bg-green-600 text-white">
                        {support.amount_percent}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Có hiệu lực đến: {formatDate(support.valid_until)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discounts */}
          {promotions.discounts && promotions.discounts.length > 0 && (
            <div className={`bg-white rounded-xl ${paddingClass} shadow-lg border-2 border-orange-200`}>
              <div className="flex items-center gap-2 mb-4">
                <Gift className="h-5 w-5 text-orange-600" />
                <h4 className={compact ? "text-lg font-bold text-gray-800" : "text-xl font-bold text-gray-800"}>Chiết khấu</h4>
              </div>
              <div className="space-y-3">
                {promotions.discounts.map((discount, idx) => (
                  <div key={idx} className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">{discount.name}</p>
                      <Badge className="bg-orange-600 text-white">
                        {discount.percent}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{discount.condition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Free Management Months */}
        {promotions.free_management_months && (
          <div className={`bg-white rounded-xl ${paddingClass} shadow-lg border-2 border-purple-200`}>
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-5 w-5 text-purple-600" />
              <h4 className={compact ? "text-lg font-bold text-gray-800" : "text-xl font-bold text-gray-800"}>Miễn phí quản lý</h4>
            </div>
            <p className="text-lg text-gray-700">
              Tặng <span className="font-bold text-purple-600">{promotions.free_management_months} tháng</span> phí quản lý đầu tiên
            </p>
          </div>
        )}

        {/* Extra Discounts */}
        {promotions.extra_discounts && promotions.extra_discounts.length > 0 && (
          <div className={`bg-white rounded-xl ${paddingClass} shadow-lg border-2 border-pink-200`}>
            <div className="flex items-center gap-2 mb-4">
              <Percent className="h-5 w-5 text-pink-600" />
              <h4 className={compact ? "text-lg font-bold text-gray-800" : "text-xl font-bold text-gray-800"}>Chiết khấu bổ sung</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {promotions.extra_discounts.map((discount, idx) => (
                <div key={idx} className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{discount.name}</p>
                    <Badge className="bg-pink-600 text-white">
                      {discount.percent}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{discount.condition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {notes && (
          <div className={`bg-white rounded-xl ${paddingClass} shadow-lg border-2 border-gray-200`}>
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-gray-600" />
              <h4 className={compact ? "text-base font-bold text-gray-800" : "text-lg font-bold text-gray-800"}>Lưu ý</h4>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              {notes.currency_note && (
                <p className="flex items-start gap-2">
                  <span className="font-semibold">• Tiền tệ:</span>
                  <span>{notes.currency_note}</span>
                </p>
              )}
              {notes.assumptions && (
                <p className="flex items-start gap-2">
                  <span className="font-semibold">• Giả định:</span>
                  <span>{notes.assumptions}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
  );

  if (compact) {
    return content;
  }

  return (
    <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <h3 className={`${titleClass} font-bold text-gray-800`}>Chính sách bán hàng</h3>
      </div>
      {content}
    </Card>
  );
}

