import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import { toast } from "react-toastify";

export const FeaturedSection = () => {
  const [services, setServices] = useState([]);
  const user = localStorage.getItem("user");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServicesTest = async () => {
      try {
        const res = await axiosClient.get("/v1/services");
        console.log(res.data);

        const testServices = res.data.data
          .filter((item) => item.category_id === "CAT001")
          .slice(0, 3);
        setServices(testServices);
      } catch (error) {
        console.log(error);
      }
    };
    fetchServicesTest();
  }, []);
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Dịch vụ xét nghiệm
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Các gói xét nghiệm và tư vấn toàn diện, được thiết kế phù hợp với
            từng nhu cầu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500">
              Không có dịch vụ xét nghiệm nào.
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service.service_id}
                className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden transition-transform hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="bg-blue-50 p-4">
                  <h3 className="text-xl font-bold text-center text-blue-800">
                    {service.name}
                  </h3>
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <p className="text-3xl font-bold text-center mb-6">
                      {Number(service.price).toLocaleString("vi-VN")} đ
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        <span>{service.description}</span>
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        <span>
                          {service.preparation_guidelines ||
                            "Không có hướng dẫn chuẩn bị"}
                        </span>
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        <span>
                          Thời gian trả kết quả:{" "}
                          {service.result_wait_time || "3-5 ngày"}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <Link
                    to={user && "/services/test"}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-center py-3 rounded-lg transition-colors mt-5"
                    style={{ marginTop: "auto" }}
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        toast.error(
                          "Vui lòng đăng nhập để sử dụng dịch vụ này!",
                          {
                            autoClose: 1000,
                            position: "top-right",
                          }
                        );
                        navigate("/login");
                      }
                    }}
                  >
                    Đặt lịch ngay
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
