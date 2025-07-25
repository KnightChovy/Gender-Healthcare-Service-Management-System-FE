import React from "react";

const PaymentStatus = ({
  paymentError,
  paymentErrorMessage,
  setPaymentError,
  paymentMethod,
  paymentProcessing,
  isPaymentComplete,
}) => {
  if (!paymentError && !paymentProcessing && !isPaymentComplete) return null;

  return (
    <div className="mt-6">
      {paymentError && (
        <div className="rounded-md bg-red-50 p-4 mb-4 border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Lỗi thanh toán
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{paymentErrorMessage}</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    onClick={() => setPaymentError(false)}
                    className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {paymentMethod === "vnpay" && paymentProcessing && !isPaymentComplete && (
        <div className="rounded-md bg-blue-50 p-4 mb-4 border border-blue-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="animate-spin h-5 w-5 text-blue-400"
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
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Đang xử lý thanh toán VNPay
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Vui lòng hoàn tất thanh toán và không đóng trình duyệt. Hệ
                  thống sẽ tự động cập nhật khi thanh toán hoàn tất.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hiển thị thông báo hoàn tất thanh toán */}
      {isPaymentComplete && (
        <div className="rounded-md bg-green-50 p-4 mb-4 border border-green-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Thanh toán thành công
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Thanh toán đã được xử lý thành công. Chi tiết lịch hẹn của bạn
                  đã được cập nhật.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
