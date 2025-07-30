import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const CyclesServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 flex flex-col h-full">
      <div className="h-36 bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center">
        <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-pink-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Theo dõi chu kỳ
            </span>
          </div>
          <h3 className="text-xl font-bold">{service.name}</h3>
          <p className="text-gray-600 my-3">
            {service.description ||
              "Theo dõi chu kỳ kinh nguyệt của bạn, dự đoán ngày rụng trứng và tư vấn sức khỏe sinh sản."}
          </p>
          <div className="mt-auto border border-pink-100 rounded-md p-2 flex justify-center bg-pink-50">
            <div className="w-full max-w-[200px]">
              <div className="flex justify-between mb-1">
                {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(
                  (day, index) => (
                    <div
                      key={index}
                      className="text-center text-[10px] font-medium text-gray-500"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              <div className="flex justify-between mb-1">
                {[1, 2, 3, 4, 5, 6, 7].map((day, index) => (
                  <div
                    key={index}
                    className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] text-gray-700"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="flex justify-between mb-1">
                {[8, 9, 10, 11, 12, 13, 14].map((day, index) => {
                  const isHighlighted = day >= 11 && day <= 14;
                  return (
                    <div
                      key={index}
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px]
                    ${
                      isHighlighted ? "bg-pink-500 text-white" : "text-gray-700"
                    }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between">
                {[15, 16, 17, 18, 19, 20, 21].map((day, index) => {
                  const isHighlighted = day === 15;
                  const isToday = day === 20;
                  return (
                    <div
                      key={index}
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px]
                    ${isHighlighted ? "bg-pink-500 text-white" : ""}
                    ${isToday ? "ring-1 ring-pink-500 bg-pink-50" : ""}
                    ${!isHighlighted && !isToday ? "text-gray-700" : ""}`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            to={user ? "/services/menstrual-cycle" : "/services"}
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
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2.5 rounded-md transition-colors font-medium w-full text-center"
          >
            Theo dõi chu kỳ
          </Link>
        </div>
      </div>
    </div>
  );
};
