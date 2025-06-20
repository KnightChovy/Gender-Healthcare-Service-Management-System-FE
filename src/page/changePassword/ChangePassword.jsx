import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import axiosClient from "../../services/axiosClient";
import { useSelector } from "react-redux";

export const ChangePassword = () => {
  const { accessToken, user } = useSelector((state) => state.auth);
  const validationSchema = Yup.object({
    currentPassword: Yup.string().required("Vui lòng nhập mật khẩu hiện tại"),
    newPassword: Yup.string()
      .min(8, "Mật khẩu ít nhất có 8 ký tự")
      .required("Vui lòng nhập mật khẩu mới"),
    confirm_Password: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Mật khẩu xác nhận không khớp")
      .required("Vui lòng xác nhận mật khẩu mới"),
  });

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setStatus }
  ) => {
    try {
      const res = await axiosClient.patch(`v1/users/${user.user_id}`, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setStatus({ success: "Đổi mật khẩu thành công!" });
      resetForm();
    } catch (error) {
      const errMsg = error.res?.data?.message || "Lỗi đổi mật khẩu";
      setStatus({ error: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white p-8 rounded-lg shadow-lg">
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirm_Password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Đổi mật khẩu
            </h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Mật khẩu hiện tại
              </label>
              <Field
                type="password"
                name="currentPassword"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage
                name="currentPassword"
                component="div"
                className="text-sm text-red-600"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Mật khẩu mới
              </label>
              <Field
                type="password"
                name="newPassword"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="text-sm text-red-600"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu mới
              </label>
              <Field
                type="password"
                name="confirm_Password"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage
                name="confirm_Password"
                component="div"
                className="text-sm text-red-600"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                }`}
              >
                {isSubmitting ? "Đang xử lý..." : "Đổi mật khẩu"}
              </button>
            </div>

            {status?.success && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700">{status.success}</p>
              </div>
            )}

            {status?.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{status.error}</p>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
