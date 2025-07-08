import React from "react";
import { format } from "date-fns";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AppointmentPDF from "./AppointmentPDF";

const CompletionStep = ({ appointmentDetails, formatPrice, navigate }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 bg-green-50">
        <div className="flex items-center">
          <svg
            className="h-8 w-8 text-green-500 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">
            Đặt lịch xét nghiệm thành công!
          </h2>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Dưới đây là thông tin chi
          tiết lịch hẹn của bạn.
        </p>
      </div>

      <div className="border-t border-gray-200">
        <dl>
          {/* Mã lịch hẹn */}
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Mã lịch hẹn</dt>
            <dd className="mt-1 text-sm font-medium text-blue-600 sm:mt-0 sm:col-span-2">
              {appointmentDetails.appointment_id || "Đang cập nhật..."}
            </dd>
          </div>

          {/* Thông tin cá nhân */}
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Họ và tên</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {appointmentDetails.userInfo.fullName}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {appointmentDetails.userInfo.email}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {appointmentDetails.userInfo.phone}
            </dd>
          </div>

          {/* Thông tin lịch hẹn */}
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Ngày xét nghiệm
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {appointmentDetails.appointmentDate}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Giờ xét nghiệm
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {appointmentDetails.appointmentTime}
            </dd>
          </div>

          {/* Thông tin dịch vụ */}
          <div className="bg-gray-50 px-4 py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 mb-3">
              Dịch vụ đã đặt
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
              <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                {appointmentDetails.services.map((service) => (
                  <li
                    key={service.service_id}
                    className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                  >
                    <div className="w-0 flex-1 flex items-center">
                      <span className="ml-2 flex-1 w-0 truncate">
                        {service.name}
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0 font-medium">
                      {formatPrice(service.price)}
                    </div>
                  </li>
                ))}
                <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm bg-blue-50">
                  <div className="w-0 flex-1 flex items-center font-medium">
                    <span className="ml-2 flex-1 w-0 truncate">Tổng cộng</span>
                  </div>
                  <div className="ml-4 flex-shrink-0 font-medium text-blue-600">
                    {formatPrice(appointmentDetails.totalAmount)}
                  </div>
                </li>
              </ul>
            </dd>
          </div>

          {/* Phương thức thanh toán */}
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Phương thức thanh toán
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
              Tiền mặt (tại cơ sở y tế)
            </dd>
          </div>
          {/* Thông tin y tế */}
          {appointmentDetails.medicalHistory && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Lịch sử bệnh
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {appointmentDetails.medicalHistory}
              </dd>
            </div>
          )}

          {/* Hướng dẫn */}
          <div className="bg-yellow-50 px-4 py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-900 mb-2">
              Lưu ý quan trọng
            </dt>
            <dd className="mt-1 text-sm text-gray-600">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Vui lòng đến trước giờ hẹn 15 phút để hoàn tất thủ tục đăng
                  ký.
                </li>
                <li>Mang theo CMND/CCCD và thẻ BHYT (nếu có).</li>
                <li>
                  Chuẩn bị các xét nghiệm theo hướng dẫn của dịch vụ (nếu có).
                </li>
                <li>
                  Nếu cần hủy hoặc đổi lịch, vui lòng thông báo trước ít nhất 24
                  giờ.
                </li>
              </ul>
            </dd>
          </div>
        </dl>
      </div>

      <div className="px-4 py-3 bg-gray-50 sm:px-6 flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <PDFDownloadLink
            document={
              <AppointmentPDF appointmentDetails={appointmentDetails} />
            }
            fileName={`Appointment-${
              appointmentDetails.appointment_id || "details"
            }.pdf`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {({ loading }) =>
              loading ? "Đang tạo PDF..." : "Tải phiếu hẹn (PDF)"
            }
          </PDFDownloadLink>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Đến trang quản lý
          </button>
          <button
            onClick={() => navigate("/services")}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Quay lại trang dịch vụ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionStep;
