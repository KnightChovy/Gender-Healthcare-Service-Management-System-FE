import React from "react";
import banner_page from "../../../assets/banner_gender.jpg";
import { Link } from "react-router-dom";
export const SectionHero = () => {
  return (
    <section className="relative">
      <img
        className="w-full h-auto object-cover"
        src={banner_page}
        alt="Gender Healthcare Banner"
      />
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 px-4 lg:px-6 py-6 lg:py-16">
              <h1 className="text-2xl md:text-4xl font-bold text-blue-800 mb-6 ">
                Trung tâm Xét nghiệm và Tư vấn Chăm sóc Sức khỏe Giới tính
                GenCare
              </h1>

              <div className="relative w-full mb-6">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-full px-5 py-3 pl-12 text-gray-700 bg-white border-0 rounded-lg shadow-md focus:outline-none"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/booking"
                  className="flex items-center bg-white rounded-lg py-2 px-5 hover:shadow-md transition-shadow"
                >
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-800 text-sm font-medium">
                    Đặt lịch xét nghiệm
                  </span>
                </Link>

                <Link
                  to="/packages"
                  className="flex items-center bg-white rounded-lg py-2 px-5 hover:shadow-md transition-shadow max-w-[235px]"
                >
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-800 text-sm font-medium">
                    Khám phá gói xét nghiệm
                  </span>
                </Link>

                <Link
                  to="/symptoms"
                  className="flex items-center bg-white rounded-lg py-2 px-5 hover:shadow-md transition-shadow"
                >
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-600"
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
                  </div>
                  <span className="text-gray-800 text-sm font-medium">
                    Đặt lịch tư vấn
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};