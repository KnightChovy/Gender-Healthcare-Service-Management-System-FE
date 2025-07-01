import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo_gender from "../../assets/gender_healthcare_logo.png";
import ToggleAccountMenu from "../ui/ToggleAccountMenu";
import { useSelector } from "react-redux";
import NotificationBell from "./NotificationBell";

export const Navbar = () => {
  const [showService, setShowService] = useState(false);

  const { accessToken, user } = useSelector((state) => state.auth);

  console.log("user", accessToken);

  const navigate = useNavigate();

  const serviceMenuRef = useRef();
  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (
        serviceMenuRef.current &&
        !serviceMenuRef.current.contains(e.target)
      ) {
        setShowService(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide);
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between">
        <div className="flex-shrink-0">
          <a href="/" className="flex items-center gap-2">
            <div className="w-12 h-12">
              <img
                className="w-full h-full object-contain"
                src={logo_gender}
                alt="Gender Healthcare Logo"
              />
            </div>
            <h2 className="text-xl font-bold text-blue-700 tracking-tight">
              Gen<span className="text-teal-600">Care</span>
            </h2>
          </a>
        </div>

        <nav className="hidden lg:flex flex-1 justify-center">
          <ul className="flex items-center gap-8 font-medium text-[16px]">
            <li className="relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
              <Link to="/">Trang chủ</Link>
            </li>
            <li className="relative" ref={serviceMenuRef}>
              <div className="flex items-center gap-1 relative group">
                {/* Chữ "Các loại dịch vụ" -> Link */}
                <Link
                  to="/services"
                  className="cursor-pointer after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200"
                >
                  Các loại dịch vụ
                </Link>

                {/* Mũi tên toggle dropdown */}
                {accessToken && (
                  <button
                    onClick={() => {
                      if (user) {
                        setShowService(!showService);
                      } else {
                        navigate("/login");
                      }
                    }}
                    className="p-1 focus:outline-none"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        showService ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                )}
              </div>

              {/* Dropdown menu */}
              {accessToken && showService && (
                <div className="absolute top-[120%] -left-8 mt-1 bg-white shadow-lg rounded-md py-2 min-w-[220px] z-50">
                  <Link
                    to="/services/test"
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors text-[16px]"
                    onClick={() => setShowService(false)}
                  >
                    Đặt lịch xét nghiệm
                  </Link>
                  <Link
                    to="/services/appointment-consultation"
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors text-[16px]"
                    onClick={() => setShowService(false)}
                  >
                    Đặt lịch tư vấn
                  </Link>
                </div>
              )}
            </li>

            <li className="relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
              <Link to="/about">Về chúng tôi</Link>
            </li>

            <li className="relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
              <Link to="/blog">Blog</Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {accessToken ? (
            <>
              <NotificationBell />
              <ToggleAccountMenu />
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="text-[16px] font-medium hover:text-blue-600 transition-colors duration-200"
              >
                Đăng Ký
              </Link>

              <div className="h-4 w-px bg-gray-300"></div>

              <Link
                to="/login"
                className="text-[16px] font-medium hover:text-blue-600 transition-colors duration-200"
              >
                Đăng Nhập
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
