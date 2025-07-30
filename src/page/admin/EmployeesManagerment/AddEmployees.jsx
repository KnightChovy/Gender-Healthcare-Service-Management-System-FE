import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";
import {
  API_ADMIN_CREATESTAFF,
  API_ADMIN_UPDATESTAFF,
} from "../../../constants/Apis";
import { toast } from "react-toastify";

const AddEmployees = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra xem có phải đang ở chế độ sửa hay không
  const isEdit = location.state?.isEdit || false;
  const staffData = location.state?.staffData || null;

  // Schema validation với Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Vui lòng nhập tên đăng nhập")
      .min(4, "Tên đăng nhập phải có ít nhất 4 ký tự"),
    password: Yup.string()
      .test("conditional-required", "Vui lòng nhập mật khẩu", function (value) {
        // Chỉ bắt buộc khi tạo mới, không bắt buộc khi sửa
        if (!isEdit) {
          return !!value;
        }
        return true;
      })
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirm_password: Yup.string().test(
      "conditional-match",
      "Mật khẩu không khớp",
      function (value) {
        const { password } = this.parent;
        if (password && !isEdit) {
          return value === password;
        }
        if (password && value) {
          return value === password;
        }
        return true;
      }
    ),
    first_name: Yup.string().required("Vui lòng nhập tên"),
    last_name: Yup.string().required("Vui lòng nhập họ"),
    gender: Yup.string().required("Vui lòng chọn giới tính"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Vui lòng nhập email"),
    phone: Yup.string()
      .required("Vui lòng nhập số điện thoại")
      .matches(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),
    role: Yup.string().required("Vui lòng chọn chức vụ"),
    birthday: Yup.date().required("Vui lòng chọn ngày sinh"),
    // Validation có điều kiện cho Doctor
    experience_year: Yup.number().when("role", {
      is: "doctor",
      then: () =>
        Yup.number()
          .required("Vui lòng nhập số năm kinh nghiệm")
          .min(0, "Số năm kinh nghiệm không hợp lệ"),
    }),
    specialization: Yup.string().when("role", {
      is: "doctor",
      then: () => Yup.string().required("Vui lòng nhập chuyên môn"),
    }),
    certificate: Yup.array().when("role", {
      is: "doctor",
      then: () =>
        Yup.array()
          .min(1, "Vui lòng thêm ít nhất một bằng cấp")
          .required("Vui lòng thêm bằng cấp"),
    }),
  });

  const initialValues = {
    username: staffData?.username || "",
    password: "",
    confirm_password: "",
    first_name: staffData?.first_name || "",
    last_name: staffData?.last_name || "",
    gender: staffData?.gender || "male",
    email: staffData?.email || "",
    phone: staffData?.phone || "",
    role: staffData?.role || "",
    birthday: staffData?.birthday || "",
    experience_year: staffData?.experience_year || "",
    certificate: staffData?.certificate || [],
    specialization: staffData?.specialization || "",
    newCertificate: "",
  };

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setStatus }
  ) => {
    try {
      const submitData = {
        username: values.username,
        first_name: values.first_name,
        last_name: values.last_name,
        gender: values.gender,
        email: values.email,
        phone: values.phone,
        role: values.role,
        birthday: values.birthday,
      };

      if (values.password) {
        submitData.password = values.password;
        submitData.confirm_password = values.confirm_password;
      }

      if (values.role === "doctor") {
        submitData.experience_year = parseInt(values.experience_year);
        submitData.certificate = values.certificate;
        submitData.specialization = values.specialization;
      }

      let response;

      if (isEdit) {
        submitData.user_id = staffData.user_id;
        response = await axiosClient.put(API_ADMIN_UPDATESTAFF, submitData);
        setStatus({
          success: true,
          message: "Cập nhật thông tin nhân viên thành công!",
        });
      } else {
        response = await axiosClient.post(API_ADMIN_CREATESTAFF, submitData);
        resetForm();
        setStatus({
          success: true,
          message: "Tạo nhân viên thành công!",
        });
      }

      toast.success("Tạo thành công", {
        autoClose: 1000,
        position: "top-right",
      });
      console.log("Success:", response.data);

      setTimeout(() => {
        navigate("/admin/employees");
      }, 2000);
    } catch (error) {
      console.error("Error:", error.response?.data);
      setStatus({
        success: false,
        message:
          error.response?.data?.message ||
          "Có lỗi xảy ra trong quá trình xử lý",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 pb-2 border-b border-gray-200">
        {isEdit ? "Cập nhật thông tin nhân viên" : "Tạo nhân viên mới"}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, errors, touched, isSubmitting, status, setFieldValue }) => (
          <Form className="space-y-6">
            {status && status.message && (
              <div
                className={`p-4 mb-4 rounded-md ${
                  status.success
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {status.message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ
                </label>
                <Field
                  type="text"
                  name="last_name"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.last_name && touched.last_name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Nhập họ"
                />
                <ErrorMessage
                  name="last_name"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên
                </label>
                <Field
                  type="text"
                  name="first_name"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.first_name && touched.first_name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Nhập tên"
                />
                <ErrorMessage
                  name="first_name"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username {isEdit && "(không thể thay đổi)"}
                </label>
                <Field
                  type="text"
                  name="username"
                  disabled={isEdit}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.username && touched.username
                      ? "border-red-500"
                      : isEdit
                      ? "bg-gray-100 border-gray-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Nhập tên đăng nhập"
                />
                <ErrorMessage
                  name="username"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh
                </label>
                <Field
                  type="date"
                  name="birthday"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.birthday && touched.birthday
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                <ErrorMessage
                  name="birthday"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <Field
                  type="password"
                  name="password"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="●●●●●●"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu
                </label>
                <Field
                  type="password"
                  name="confirm_password"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.confirm_password && touched.confirm_password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="●●●●●●"
                />
                <ErrorMessage
                  name="confirm_password"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
            </div>

            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">
                Giới tính
              </p>
              <div className="flex space-x-6">
                <label className="flex items-center cursor-pointer">
                  <Field
                    type="radio"
                    name="gender"
                    value="male"
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="ml-2 text-gray-700">Nam</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <Field
                    type="radio"
                    name="gender"
                    value="female"
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="ml-2 text-gray-700">Nữ</span>
                </label>
              </div>
              <ErrorMessage
                name="gender"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email && touched.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="example@email.com"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <Field
                  type="text"
                  name="phone"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.phone && touched.phone
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="0123456789"
                />
                <ErrorMessage
                  name="phone"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chức vụ
              </label>
              <Field
                as="select"
                name="role"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white ${
                  errors.role && touched.role
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="" disabled>
                  Chọn chức vụ
                </option>
                <option value="manager">Quản lí</option>
                <option value="doctor">Bác sĩ</option>
                <option value="staff">Nhân viên</option>
              </Field>
              <ErrorMessage
                name="role"
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {values.role === "doctor" && (
              <div className="p-5 border border-blue-200 rounded-lg bg-blue-50 shadow-sm">
                <h3 className="text-lg font-medium text-blue-800 mb-4 pb-2 border-b border-blue-200">
                  Thông tin chuyên môn bác sĩ
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số năm kinh nghiệm
                      </label>
                      <div className="relative">
                        <Field
                          type="number"
                          name="experience_year"
                          min="0"
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.experience_year && touched.experience_year
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Nhập số năm kinh nghiệm"
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center pr-3 text-gray-500 pointer-events-none">
                          năm
                        </span>
                      </div>
                      <ErrorMessage
                        name="experience_year"
                        component="p"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Chuyên môn
                      </label>
                      <Field
                        type="text"
                        name="specialization"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.specialization && touched.specialization
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Ví dụ: Phụ khoa, Nam khoa"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Ghi rõ các lĩnh vực chuyên môn chính của bác sĩ
                      </p>
                      <ErrorMessage
                        name="specialization"
                        component="p"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bằng cấp
                    </label>

                    <FieldArray name="certificate">
                      {({ push, remove }) => (
                        <>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Ví dụ: Chuyên khoa II"
                              value={values.newCertificate || ""}
                              onChange={(e) => {
                                setFieldValue("newCertificate", e.target.value);
                              }}
                              onKeyPress={(e) => {
                                if (
                                  e.key === "Enter" &&
                                  values.newCertificate?.trim()
                                ) {
                                  e.preventDefault();
                                  push(values.newCertificate.trim());
                                  setFieldValue("newCertificate", "");
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                              onClick={() => {
                                if (values.newCertificate?.trim()) {
                                  push(values.newCertificate.trim());
                                  setFieldValue("newCertificate", "");
                                }
                              }}
                            >
                              Thêm
                            </button>
                          </div>

                          {values.certificate.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Danh sách bằng cấp:
                              </p>
                              <ul className="space-y-2">
                                {values.certificate.map((cert, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center justify-between bg-white p-2 rounded-md border border-gray-200"
                                  >
                                    <span className="text-gray-800">
                                      {cert}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="text-red-500 hover:text-red-700 focus:outline-none"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </FieldArray>

                    <ErrorMessage
                      name="certificate"
                      component="p"
                      className="mt-2 text-sm text-red-600"
                    />
                    {values.certificate.length === 0 && (
                      <p className="text-xs text-red-500 mt-2">
                        Vui lòng thêm ít nhất một bằng cấp
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/employees")}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium text-sm shadow-sm"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-sm shadow-sm ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting
                  ? "Đang xử lý..."
                  : isEdit
                  ? "Cập nhật"
                  : "Tạo nhân viên"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddEmployees;
