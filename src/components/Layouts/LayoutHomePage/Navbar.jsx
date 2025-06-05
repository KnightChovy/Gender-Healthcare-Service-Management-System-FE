import React from "react";
import logo_gender from "../../../assets/gender_healthcare_logo.png";
import { Link } from "react-router-dom";
export const Navbar = () => {
  return (
    <div>
      <div className="container flex items-center justify-center">
        <div className="flex-shrink-0">
          <Link className="block max-w-[70px]" to="/">
            <img className="max-w-full" src={logo_gender} alt="logo_gender" />
          </Link>
        </div>
        <nav className="hidden lg:flex flex-1 justify-center">
          <ul className="flex items-center gap-10 font-medium text-[18px]">
            <li className="relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
              <Link to="/">Trang chủ</Link>
            </li>
            <li className="relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
              <a href="#">Các loại dịch vụ</a>
            </li>
            <li className="relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
              <a href="#">Về chúng tôi</a>
            </li>
            <li className="relative after:absolute after:h-[1.5px] after:bg-blue-800 after:left-0 after:bottom-[-2px] after:transition-all after:duration-300 after:w-full after:scale-x-0 hover:after:scale-x-100 hover:text-blue-900 transition-colors duration-200">
              <a href="#">Blog</a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/register"
            className="text-[16px] font-medium hover:text-blue-600 transition-colors duration-200"
          >
            Đăng Ký
          </Link>
          <div className="h-4 w-px bg-gray-300"></div>
          <Link
            to="/Login"
            className="text-[16px] font-medium hover:text-blue-600 transition-colors duration-200"
          >
            Đăng Nhập
          </Link>
        </div>
      </div>
    </div>
  );
};
