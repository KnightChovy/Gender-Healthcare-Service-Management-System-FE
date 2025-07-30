import React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const ConfirmationStep = ({
  userInfo,
  selectedDate,
  selectedTimeSlot,
  selectedServices,
  medicalHistory,
  formatPrice,
  calculateTotalAmount,
  handleNextStep,
  handlePreviousStep,
  loading,
  paymentProcessing,
  paymentMethod,
  setPaymentMethod,
}) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 bg-blue-50">
        <h2 className="text-lg font-medium text-gray-900">
          Bước 3: Xác nhận thông tin và thanh toán
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Vui lòng kiểm tra lại thông tin đặt lịch
        </p>
      </div>

      <div className="border-t border-gray-200">
        <dl>
          {/* Thông tin cá nhân */}
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Họ và tên</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {userInfo.fullName}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {userInfo.email}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {userInfo.phone}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Giới tính</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {userInfo.gender === "male"
                ? "Nam"
                : userInfo.gender === "female"
                ? "Nữ"
                : "Khác"}
            </dd>
          </div>

          {/* Thông tin lịch hẹn */}
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Ngày xét nghiệm
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Giờ xét nghiệm
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {selectedTimeSlot}
            </dd>
          </div>

          {/* Thông tin dịch vụ */}
          <div className="bg-gray-50 px-4 py-5 sm:px-6">
            <div className="mb-3 sm:flex sm:justify-between">
              <dt className="text-sm font-medium text-gray-500">
                Dịch vụ đã chọn
              </dt>
              <dd className="text-sm font-medium text-blue-600">
                Tổng cộng: {formatPrice(calculateTotalAmount())}
              </dd>
            </div>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tên dịch vụ
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Giá
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedServices.map((service) => (
                      <tr key={service.service_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {service.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatPrice(service.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </dd>
          </div>

          {/* Thông tin y tế */}
          {medicalHistory && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Lịch sử bệnh
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {medicalHistory}
              </dd>
            </div>
          )}

          {/* Phương thức thanh toán */}
          <div className="bg-gray-50 px-4 py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 mb-4">
              Phương thức thanh toán
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
              <div className="flex flex-col gap-2">
                <span className="block text-sm font-medium text-gray-700">
                  Thanh toán tại cơ sở y tế
                </span>
              </div>
            </dd>
          </div>
        </dl>
      </div>

      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between">
        <button
          onClick={handlePreviousStep}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Quay lại
        </button>
        <button
          onClick={handleNextStep}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading || paymentProcessing}
        >
          {loading || paymentProcessing ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {paymentProcessing ? "Đang xử lý thanh toán..." : "Đang xử lý..."}
            </span>
          ) : (
            "Xác nhận đặt lịch"
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
