import React from "react";
import { ServiceCard } from "./ServiceCard";
export const PersonalInfoStep = (props) => {
  const {
    userInfo,
    handleUserInfoChange,
    medicalHistory,
    handleMedicalHistoryChange,
    allServices,
    selectedServices,
    handleServiceChange,
    calculateTotalAmount,
    formatPrice,
    handleNextStep,
  } = props;
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 bg-blue-50">
        <h2 className="text-lg font-medium text-gray-900">
          Bước 1: Thông tin cá nhân & dịch vụ
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Vui lòng điền thông tin cá nhân và chọn dịch vụ xét nghiệm
        </p>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Thông tin cá nhân
        </h3>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={userInfo.fullName}
              onChange={handleUserInfoChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-7 p-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={userInfo.email}
              onChange={handleUserInfoChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-7 p-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={userInfo.phone}
              onChange={handleUserInfoChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-7 p-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700"
            >
              Ngày sinh
            </label>
            <input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              value={userInfo.birthday}
              onChange={handleUserInfoChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-7 p-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Giới tính
            </label>
            <select
              id="gender"
              name="gender"
              value={userInfo.gender}
              onChange={handleUserInfoChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="sm:col-span-6">
            <label
              htmlFor="medicalHistory"
              className="block text-sm font-medium text-gray-700"
            >
              Lịch sử bệnh (nếu có)
            </label>
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              rows={3}
              placeholder="Vui lòng liệt kê các bệnh lý, tiền sử dị ứng, thông tin thuốc đang sử dụng hoặc các vấn đề sức khỏe khác mà bạn nghĩ rằng chúng tôi nên biết."
              value={medicalHistory}
              onChange={handleMedicalHistoryChange}
              className="mt-1 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">
          Dịch vụ xét nghiệm
        </h3>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="selectAll"
            checked={
              selectedServices.length === allServices.length &&
              allServices.length > 0
            }
            onChange={(e) => {
              if (e.target.checked) {
                handleServiceChange("selectAll", allServices);
              } else {
                handleServiceChange("deselectAll", []);
              }
            }}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label
            htmlFor="selectAll"
            className="ml-2 text-sm font-medium text-gray-700"
          >
            Chọn tất cả dịch vụ
          </label>
        </div>

        <div className="space-y-4">
          {allServices.map((service) => (
            <ServiceCard
              key={service.service_id}
              service={service}
              isSelected={selectedServices.some(
                (s) => s.service_id === service.service_id
              )}
              onChange={handleServiceChange}
              formatPrice={formatPrice}
            />
          ))}
        </div>

        {selectedServices.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Tổng chi phí:</span>
              <span className="text-lg font-bold text-blue-600">
                {formatPrice(calculateTotalAmount())}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
          onClick={handleNextStep}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};
