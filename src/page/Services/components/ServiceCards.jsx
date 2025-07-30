import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const hashServiceId = (serviceId) => {
  return btoa(serviceId.toString()).replace(/=/g, "");
};
export const ServiceCards = ({ service }) => {
  console.log(service);
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const cateConfig = {
    CAT001: {
      color: "blue",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      ),
      badge: service.result_wait_time
        ? `${service.result_wait_time} ngày có kết quả`
        : "3-5 ngày có kết quả",
      badgeColors: "green",
      pathName: "/services/test",
      buttonText: "Đặt lịch xét nghiệm",
    },
    CAT002: {
      color: "indigo",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
        />
      ),
      badge: "Tư vấn trực tiếp",
      badgeColor: "indigo",
      pathName: "/services/appointment-consultation",
      buttonText: "Đặt lịch tư vấn",
    },
  };
  const config = cateConfig[service.category_id];
  if (!config) return null;
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <div
        className={`h-36 bg-gradient-to-r from-${config.color}-500 to-${config.color}-700 flex items-center justify-center`}
      >
        <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-10 w-10 text-${config.color}-600`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {config.icon}
          </svg>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            {config.badge && (
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`bg-${config.badgeColor}-100 text-${config.badgeColor}-800 text-xs font-medium px-2.5 py-0.5 rounded`}
                >
                  {config.badge}
                </span>
              </div>
            )}
            <h3 className="text-[17px] font-bold h-12">{service.name}</h3>
          </div>
          <div className={`font-bold text-${config.color}-600`}>
            {service.price && (
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(service.price)}
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-600 mt-3 h-12">
          {service.description || "Không có mô tả chi tiết"}
        </p>

        <div className="mt-4 p-3 h-30 bg-gray-50 rounded-md">
          <h4 className="font-medium text-gray-700">Hướng dẫn chuẩn bị:</h4>
          <p className="text-gray-600 mt-1 text-sm">
            {service.preparation_guidelines || "Không có hướng dẫn cụ thể."}
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            to={
              user
                ? {
                    pathname: config.pathName,
                    search:
                      service.service_id &&
                      config.pathName !== "/services/menstrual-cycle"
                        ? `?serviceId=${hashServiceId(service.service_id)}`
                        : "",
                  }
                : "#"
            }
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                toast.error("Vui lòng đăng nhập để sử dụng dịch vụ này!", {
                  autoClose: 1000,
                  position: "top-right",
                });
                navigate("/login");
              }
            }}
            className={`bg-${config.color}-600 hover:bg-${config.color}-700 text-white px-4 py-2 rounded-md transition-colors `}
          >
            {config.buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
};
