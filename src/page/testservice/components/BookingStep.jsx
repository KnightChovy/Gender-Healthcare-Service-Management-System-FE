import React from "react";

export const BookingStepIndicator = ({ currentStep }) => {
  return (
    <div>
      {" "}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div
            className={`flex flex-col items-center ${
              currentStep >= 1 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 1
                  ? "border-blue-600 bg-blue-100"
                  : "border-gray-300"
              }`}
            >
              <span className="font-medium">1</span>
            </div>
            <span className="text-xs mt-1">Thông tin</span>
          </div>

          <div
            className={`flex-1 h-1 mx-2 ${
              currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"
            }`}
          ></div>

          <div
            className={`flex flex-col items-center ${
              currentStep >= 2 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 2
                  ? "border-blue-600 bg-blue-100"
                  : "border-gray-300"
              }`}
            >
              <span className="font-medium">2</span>
            </div>
            <span className="text-xs mt-1">Lịch hẹn</span>
          </div>

          <div
            className={`flex-1 h-1 mx-2 ${
              currentStep >= 3 ? "bg-blue-600" : "bg-gray-300"
            }`}
          ></div>

          <div
            className={`flex flex-col items-center ${
              currentStep >= 3 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 3
                  ? "border-blue-600 bg-blue-100"
                  : "border-gray-300"
              }`}
            >
              <span className="font-medium">3</span>
            </div>
            <span className="text-xs mt-1">Xác nhận</span>
          </div>

          <div
            className={`flex-1 h-1 mx-2 ${
              currentStep >= 4 ? "bg-blue-600" : "bg-gray-300"
            }`}
          ></div>

          <div
            className={`flex flex-col items-center ${
              currentStep >= 4 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 4
                  ? "border-blue-600 bg-blue-100"
                  : "border-gray-300"
              }`}
            >
              <span className="font-medium">4</span>
            </div>
            <span className="text-xs mt-1">Hoàn tất</span>
          </div>
        </div>
      </div>
    </div>
  );
};
