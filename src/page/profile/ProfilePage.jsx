import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserCircle,
  faEnvelope,
  faPhone,
  faBirthdayCake,
  faVenusMars,
  faMapMarkerAlt,
  faEdit,
  faSave,
  faSpinner,
  faExclamationTriangle,
  faCheckCircle,
  faTimes,
  faShieldAlt,
  faIdCard,
  faCalendarCheck,
  faFileText,
  faCalendarAlt,
  faUserMd,
  faClock,
  faDownload,
  faVial,
  faHourglass,
  faRulerHorizontal,
  faLightbulb,
  faPrint,
  faClipboardCheck,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../services/axiosClient";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MedicalRecord } from "./MedicalRecord";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [medicalLoading, setMedicalLoading] = useState(false);
  const [medicalError, setMedicalError] = useState(null);

  const fetchMedicalRecords = useCallback(async () => {
    try {
      setMedicalLoading(true);
      setMedicalError(null);

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Không tìm thấy thông tin đăng nhập");
      }

      const response = await axiosClient.get("/v1/users/test-results", {
        headers: {
          "x-access-token": accessToken,
        },
      });

      if (response.data?.status === "success") {
        const testResults = response.data.data?.results || [];

        const transformedRecords = testResults.map((result, index) => ({
          id: result.testresult_id || `record_${index}`,
          visitDate: result.exam_date,
          visitTime: result.exam_time,
          doctor: "Trung tâm GenCare",
          consultationType: result.service.name,
          chiefComplaint: result.service.description,
          orderInfo: {
            order_id: result.order_id,
            order_detail_id: result.order_detail_id,
            service_id: result.service.service_id,
          },
          vitalSigns: {
            weight: "Không có dữ liệu",
            height: "Không có dữ liệu",
            bloodPressure: result.result?.result || "Không có dữ liệu",
            temperature: "Không có dữ liệu",
            heartRate: "Không có dữ liệu",
          },
          diagnosis: {
            preliminaryDiagnosis: result.service.name,
            finalDiagnosis: result.result?.conclusion || "Chưa có kết luận",
            icdCode: "Không có mã",
          },
          treatment: {
            recommendations: result.result?.recommendations
              ? result.result.recommendations
                  .split(",")
                  .map((rec) => rec.trim())
              : ["Theo dõi kết quả", "Tái khám nếu có triệu chứng bất thường"],
          },
          testResult: {
            result: result.result?.result,
            conclusion: result.result?.conclusion,
            normal_range: result.result?.normal_range,
            recommendations: result.result?.recommendations,
            created_at: result.result?.created_at,
          },
          serviceInfo: {
            name: result.service.name,
            description: result.service.description,
            result_wait_time: result.service.result_wait_time,
          },
          notes:
            result.result?.recommendations ||
            "Kết quả xét nghiệm đã được ghi nhận.",
          status: "completed",
          created_at: result.created_at,
        }));

        setMedicalRecords(transformedRecords);
        console.log("✅ Medical records loaded:", transformedRecords);
      } else {
        throw new Error(
          response.data?.message || "Không thể tải hồ sơ bệnh án"
        );
      }
    } catch (err) {
      console.error("❌ Error fetching medical records:", err);
      setMedicalError(err.message || "Đã xảy ra lỗi khi tải hồ sơ bệnh án");
      setMedicalRecords([]);
    } finally {
      setMedicalLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("Không tìm thấy thông tin đăng nhập");
        }

        const response = await axiosClient.get("/v1/users/profile/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-access-token": accessToken,
          },
        });

        if (response.data?.success) {
          const userData = response.data.userProfile;

          const transformedData = {
            ...userData,
            birthday: userData.birthday || "",
          };

          setProfile(transformedData);

          setFormData({
            first_name: transformedData.first_name || "",
            last_name: transformedData.last_name || "",
            email: transformedData.email || "",
            phone: transformedData.phone || "",
            birthday: transformedData.birthday || "",
            gender: transformedData.gender || "",
            address: transformedData.address || "",
          });

          await fetchMedicalRecords();

          console.log("✅ User profile loaded:", transformedData);
        } else {
          throw new Error(
            response.data?.message || "Không thể tải thông tin người dùng"
          );
        }
      } catch (err) {
        console.error("❌ Error fetching user profile:", err);
        setError(err.message || "Đã xảy ra lỗi khi tải thông tin người dùng");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [fetchMedicalRecords]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        birthday: profile.birthday || "",
        gender: profile.gender || "",
        address: profile.address || "",
      });
    }
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axiosClient.put(
        `/v1/users/${user.user_id}`,
        formData,
        {
          headers: {
            "x-access-token": accessToken,
          },
        }
      );

      if (response.data.message) {
        setProfile({
          ...profile,
          ...formData,
        });
        setIsEditing(false);
        toast.success("Cập nhật thông tin thành công!");
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      } else {
        throw new Error(
          response.data?.message || "Không thể cập nhật thông tin người dùng"
        );
      }
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      toast.error(err.message || "Đã xảy ra lỗi khi cập nhật thông tin");
    } finally {
      setIsSubmitting(false);
    }
  };

  const viewMedicalRecord = (record) => {
    setSelectedRecord(record);
    setShowMedicalModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch (error) {
      console.error("❌ Error formatting date:", error);
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Chưa cập nhật";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("❌ Error formatting date:", error);
      return dateString;
    }
  };

  const getGenderText = (gender) => {
    if (!gender) return "Chưa cập nhật";

    switch (gender.toLowerCase()) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      default:
        return gender;
    }
  };

  const getResultClass = (conclusion) => {
    if (!conclusion) return "";

    const lowerConclusion = conclusion.toLowerCase();
    if (
      lowerConclusion.includes("bình thường") ||
      lowerConclusion.includes("âm tính")
    ) {
      return "bg-green-50 border-green-500";
    } else if (lowerConclusion.includes("cần theo dõi")) {
      return "bg-amber-50 border-amber-500";
    } else if (
      lowerConclusion.includes("dương tính") ||
      lowerConclusion.includes("bất thường")
    ) {
      return "bg-red-50 border-red-500";
    }
    return "bg-gray-50 border-gray-500";
  };

  const getResultIconColor = (conclusion) => {
    if (!conclusion) return "text-gray-500 bg-gray-100";

    const lowerConclusion = conclusion.toLowerCase();
    if (
      lowerConclusion.includes("bình thường") ||
      lowerConclusion.includes("âm tính")
    ) {
      return "text-green-600 bg-green-100";
    } else if (lowerConclusion.includes("cần theo dõi")) {
      return "text-amber-600 bg-amber-100";
    } else if (
      lowerConclusion.includes("dương tính") ||
      lowerConclusion.includes("bất thường")
    ) {
      return "text-red-600 bg-red-100";
    }
    return "text-gray-600 bg-gray-100";
  };

  const getResultTextColor = (conclusion) => {
    if (!conclusion) return "text-gray-600";

    const lowerConclusion = conclusion.toLowerCase();
    if (
      lowerConclusion.includes("bình thường") ||
      lowerConclusion.includes("âm tính")
    ) {
      return "text-green-600";
    } else if (lowerConclusion.includes("cần theo dõi")) {
      return "text-amber-600";
    } else if (
      lowerConclusion.includes("dương tính") ||
      lowerConclusion.includes("bất thường")
    ) {
      return "text-red-600";
    }
    return "text-gray-600";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-gray-700">
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          className="text-4xl text-blue-500 mb-4"
        />
        <p className="text-lg">Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-gray-700 bg-gray-50 rounded-lg">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-4xl text-yellow-500 mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">
          Không thể tải thông tin người dùng
        </h2>
        <p className="text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 text-gray-800 font-sans">
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl text-gray-800 flex items-center gap-3">
          <FontAwesomeIcon icon={faUser} className="text-blue-500" />
          Thông tin cá nhân
        </h1>
        <p className="text-gray-600 mt-2 ml-9">
          Quản lý thông tin cá nhân của bạn
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-64 flex-shrink-0">
          <div className="text-center p-6 bg-gray-50 rounded-lg mb-6">
            <FontAwesomeIcon
              icon={faUserCircle}
              className="text-6xl text-blue-500"
            />
            {profile?.first_name && profile?.last_name && (
              <p className="mt-3 font-medium text-lg">
                {`${profile.last_name} ${profile.first_name}`}
              </p>
            )}
          </div>

          <nav className="flex flex-col gap-2 mb-6">
            <button
              className={`flex items-center gap-3 px-4 py-3 rounded-md border transition-colors text-left ${
                activeTab === "personal"
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("personal")}
            >
              <FontAwesomeIcon
                icon={faIdCard}
                className={
                  activeTab === "personal" ? "text-white" : "text-gray-500"
                }
              />
              Thông tin cá nhân
            </button>
            <button
              className={`flex items-center gap-3 px-4 py-3 rounded-md border transition-colors text-left ${
                activeTab === "medical"
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("medical")}
            >
              <FontAwesomeIcon
                icon={faFileText}
                className={
                  activeTab === "medical" ? "text-white" : "text-gray-500"
                }
              />
              Hồ sơ bệnh án
            </button>
            <button
              className={`flex items-center gap-3 px-4 py-3 rounded-md border transition-colors text-left ${
                activeTab === "security"
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("security")}
            >
              <FontAwesomeIcon
                icon={faShieldAlt}
                className={
                  activeTab === "security" ? "text-white" : "text-gray-500"
                }
              />
              Bảo mật tài khoản
            </button>
          </nav>

          <div>
            <Link
              to="/my-appointments"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors"
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
              Lịch hẹn của tôi
            </Link>
          </div>
        </div>

        <div className="flex-1">
          {activeTab === "personal" && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Thông tin cá nhân
                </h2>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    title="Chỉnh sửa thông tin cá nhân"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Chỉnh sửa
                  </button>
                ) : (
                  <div className="flex items-center">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                      Hủy
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="flex flex-col">
                      <span className="text-gray-600 mb-1">Họ</span>
                      {isEditing ? (
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                          placeholder="Nhập họ"
                        />
                      ) : (
                        <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
                          {profile?.last_name || "Chưa cập nhật"}
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="flex flex-col">
                    <label className="flex flex-col">
                      <span className="text-gray-600 mb-1">Tên</span>
                      {isEditing ? (
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                          placeholder="Nhập tên"
                        />
                      ) : (
                        <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
                          {profile?.first_name || "Chưa cập nhật"}
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="flex flex-col">
                    <label className="flex flex-col">
                      <span className="text-gray-600 mb-1 flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          className="text-gray-500"
                        />
                        Email
                      </span>
                      <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 text-blue-600">
                        {profile?.email}
                      </div>
                    </label>
                  </div>

                  <div className="flex flex-col">
                    <label className="flex flex-col">
                      <span className="text-gray-600 mb-1 flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faPhone}
                          className="text-gray-500"
                        />
                        Số điện thoại
                      </span>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                          placeholder="Nhập số điện thoại"
                        />
                      ) : (
                        <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
                          {profile?.phone || "Chưa cập nhật"}
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="flex flex-col">
                    <label className="flex flex-col">
                      <span className="text-gray-600 mb-1 flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faBirthdayCake}
                          className="text-gray-500"
                        />
                        Ngày sinh
                      </span>
                      {isEditing ? (
                        <input
                          type="date"
                          name="birthday"
                          value={formData.birthday}
                          onChange={handleChange}
                          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        />
                      ) : (
                        <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
                          {formatDate(profile?.birthday)}
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="flex flex-col">
                    <label className="flex flex-col">
                      <span className="text-gray-600 mb-1 flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faVenusMars}
                          className="text-gray-500"
                        />
                        Giới tính
                      </span>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                        </select>
                      ) : (
                        <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
                          {getGenderText(profile?.gender)}
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="flex flex-col">
                      <span className="text-gray-600 mb-1 flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="text-gray-500"
                        />
                        Địa chỉ
                      </span>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                          placeholder="Nhập địa chỉ"
                        />
                      ) : (
                        <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
                          {profile?.address || "Chưa cập nhật"}
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave} />
                          Lưu thay đổi
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === "medical" && (
            <MedicalRecord
              medicalRecords={medicalRecords}
              setMedicalRecords={setMedicalRecords}
              medicalLoading={medicalLoading}
              setMedicalLoading={setMedicalLoading}
              medicalError={medicalError}
              setMedicalError={setMedicalError}
              formatDateTime={formatDateTime}
              viewMedicalRecord={viewMedicalRecord}
            />
          )}

          {activeTab === "security" && (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Bảo mật tài khoản
              </h2>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-3 px-4 bg-gray-50 rounded-md">
                    <span className="text-gray-600">Trạng thái tài khoản:</span>
                    <span className="flex items-center gap-2 text-green-600 font-medium">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500"
                      />
                      Hoạt động
                    </span>
                  </div>
                  <div className="flex justify-between py-3 px-4 bg-gray-50 rounded-md">
                    <span className="text-gray-600">Email chính:</span>
                    <span className="flex items-center gap-2 text-blue-600">
                      {profile?.email}
                      {profile?.email_verified && (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-green-500"
                          title="Email đã xác thực"
                        />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Medical Record Detail Modal */}
      {showMedicalModal && selectedRecord && (
        <div
          className="fixed inset-0 bg-gray-800/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 overflow-y-auto"
          onClick={() => setShowMedicalModal(false)}
        >
          <div
            className="w-full max-w-5xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-4">
                <FontAwesomeIcon
                  icon={faFileText}
                  className="text-2xl text-blue-500 bg-blue-100/80 p-3 rounded-full flex items-center justify-center w-12 h-12 flex-shrink-0"
                />
                <div>
                  <h2 className="m-0 text-xl font-semibold text-gray-800">
                    {selectedRecord.individualResults?.length > 1
                      ? `Kết quả xét nghiệm (${selectedRecord.individualResults.length} kết quả)`
                      : "Kết quả xét nghiệm"}
                  </h2>
                  <p className="mt-1 mb-0 text-sm text-gray-500">
                    {formatDate(selectedRecord.visitDate)} | Mã đơn:{" "}
                    {selectedRecord.orderInfo?.order_id}
                  </p>
                </div>
              </div>
              <button
                className="bg-transparent border-none text-gray-500 text-xl w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => setShowMedicalModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Check if we have individual results to display separately */}
              {selectedRecord.individualResults &&
              selectedRecord.individualResults.length > 0 ? (
                <div className="space-y-6">
                  {selectedRecord.individualResults.map((result, index) => (
                    <div
                      key={result.testresult_id || index}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                    >
                      {/* Result Header */}
                      {selectedRecord.individualResults.length > 1 && (
                        <div className="bg-blue-50 border-b border-blue-200 p-4">
                          <h4 className="m-0 text-lg font-semibold text-blue-800">
                            Kết quả {index + 1}: {result.service?.name}
                          </h4>
                        </div>
                      )}

                      {/* Result Content */}
                      <div className="p-5">
                        {/* Service Info */}
                        <div className="mb-6">
                          <h4 className="m-0 mb-3 text-lg text-gray-800">
                            {result.service?.name}
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-2 py-2 px-3 bg-gray-100 rounded-full text-sm text-gray-600">
                              <FontAwesomeIcon
                                icon={faCalendarAlt}
                                className="text-gray-500 text-sm"
                              />
                              {formatDate(result.exam_date)}
                            </span>
                            <span className="inline-flex items-center gap-2 py-2 px-3 bg-gray-100 rounded-full text-sm text-gray-600">
                              <FontAwesomeIcon
                                icon={faClock}
                                className="text-gray-500 text-sm"
                              />
                              {result.exam_time}
                            </span>
                            <span className="inline-flex items-center gap-2 py-2 px-3 bg-blue-50 rounded-full text-sm text-blue-600">
                              <FontAwesomeIcon
                                icon={faUserMd}
                                className="text-blue-500 text-sm"
                              />
                              {result.doctor || "Trung tâm GenCare"}
                            </span>
                          </div>
                        </div>

                        {/* Result Summary */}
                        <div
                          className={`flex items-center gap-5 p-5 rounded-lg mb-6 border-l-4 ${getResultClass(
                            result.result?.conclusion
                          )}`}
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getResultIconColor(
                              result.result?.conclusion
                            )}`}
                          >
                            <FontAwesomeIcon
                              icon={
                                result.result?.conclusion
                                  ?.toLowerCase()
                                  .includes("bình thường") ||
                                result.result?.conclusion
                                  ?.toLowerCase()
                                  .includes("âm tính")
                                  ? faCheckCircle
                                  : faExclamationTriangle
                              }
                              className="text-xl"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-lg font-semibold text-gray-700 mb-1">
                              {result.result?.conclusion
                                ?.toLowerCase()
                                .includes("bình thường") ||
                              result.result?.conclusion
                                ?.toLowerCase()
                                .includes("âm tính")
                                ? "Kết quả xét nghiệm bình thường"
                                : "Kết quả xét nghiệm cần chú ý"}
                            </div>
                            <div className="text-lg text-gray-600 font-medium">
                              {result.result?.result}
                              {result.result?.normal_range && (
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                  (Tham chiếu: {result.result.normal_range})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Detailed Results */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-base text-gray-700 m-0 mb-3">
                              Thông tin chi tiết
                            </h4>
                            <div className="space-y-3">
                              <div
                                className={`flex flex-col gap-1 p-3 rounded-md border-l-[3px] ${getResultClass(
                                  result.result?.conclusion
                                )}`}
                              >
                                <span className="flex items-center gap-2 font-medium text-gray-500 text-sm">
                                  <FontAwesomeIcon
                                    icon={faVial}
                                    className="text-gray-500"
                                  />
                                  Kết quả:
                                </span>
                                <span
                                  className={`text-base font-medium ${getResultTextColor(
                                    result.result?.conclusion
                                  )}`}
                                >
                                  {result.result?.result || "Chưa có kết quả"}
                                </span>
                              </div>

                              <div
                                className={`flex flex-col gap-1 p-3 rounded-md border-l-[3px] ${getResultClass(
                                  result.result?.conclusion
                                )}`}
                              >
                                <span className="flex items-center gap-2 font-medium text-gray-500 text-sm">
                                  <FontAwesomeIcon
                                    icon={faClipboardCheck}
                                    className="text-gray-500"
                                  />
                                  Kết luận:
                                </span>
                                <span
                                  className={`text-base font-medium ${getResultTextColor(
                                    result.result?.conclusion
                                  )}`}
                                >
                                  {result.result?.conclusion ||
                                    "Chưa có kết luận"}
                                </span>
                              </div>

                              {result.result?.normal_range && (
                                <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-md">
                                  <span className="flex items-center gap-2 font-medium text-gray-500 text-sm">
                                    <FontAwesomeIcon
                                      icon={faRulerHorizontal}
                                      className="text-gray-500"
                                    />
                                    Giá trị tham chiếu:
                                  </span>
                                  <span className="text-base text-gray-700">
                                    {result.result.normal_range}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-base text-gray-700 m-0 mb-3">
                              Thông tin dịch vụ
                            </h4>
                            <div className="space-y-3">
                              <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-md">
                                <span className="flex items-center gap-2 font-medium text-gray-500 text-sm">
                                  <FontAwesomeIcon
                                    icon={faFileAlt}
                                    className="text-gray-500"
                                  />
                                  Mô tả:
                                </span>
                                <span className="text-base text-gray-700">
                                  {result.service?.description ||
                                    "Không có mô tả"}
                                </span>
                              </div>

                              <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-md">
                                <span className="flex items-center gap-2 font-medium text-gray-500 text-sm">
                                  <FontAwesomeIcon
                                    icon={faHourglass}
                                    className="text-gray-500"
                                  />
                                  Thời gian chờ kết quả:
                                </span>
                                <span className="text-base text-gray-700">
                                  {result.service?.result_wait_time ||
                                    "Không xác định"}
                                </span>
                              </div>

                              <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-md">
                                <span className="flex items-center gap-2 font-medium text-gray-500 text-sm">
                                  <FontAwesomeIcon
                                    icon={faCalendarCheck}
                                    className="text-gray-500"
                                  />
                                  Ngày có kết quả:
                                </span>
                                <span className="text-base text-gray-700">
                                  {formatDateTime(result.result?.created_at) ||
                                    "---"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Recommendations */}
                        {result.result?.recommendations && (
                          <div className="mt-6 bg-amber-50 rounded-lg p-4 border border-amber-200">
                            <div className="flex items-center gap-3 mb-3">
                              <FontAwesomeIcon
                                icon={faLightbulb}
                                className="text-amber-500 text-xl"
                              />
                              <h4 className="m-0 text-base text-amber-800">
                                Khuyến nghị từ bác sĩ
                              </h4>
                            </div>
                            <p className="m-0 text-amber-700 leading-relaxed">
                              {result.result.recommendations}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Divider between results */}
                      {index < selectedRecord.individualResults.length - 1 && (
                        <hr className="border-gray-200 border-t-2" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Fallback to single result display */
                <div className="space-y-6">
                  {/* Single Result Summary */}
                  <div
                    className={`flex items-center gap-5 p-5 rounded-lg mb-6 border-l-4 ${getResultClass(
                      selectedRecord.testResult?.conclusion
                    )}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getResultIconColor(
                        selectedRecord.testResult?.conclusion
                      )}`}
                    >
                      <FontAwesomeIcon
                        icon={
                          selectedRecord.testResult?.conclusion
                            ?.toLowerCase()
                            .includes("bình thường") ||
                          selectedRecord.testResult?.conclusion
                            ?.toLowerCase()
                            .includes("âm tính")
                            ? faCheckCircle
                            : faExclamationTriangle
                        }
                        className="text-xl"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-gray-700 mb-1">
                        {selectedRecord.testResult?.conclusion
                          ?.toLowerCase()
                          .includes("bình thường") ||
                        selectedRecord.testResult?.conclusion
                          ?.toLowerCase()
                          .includes("âm tính")
                          ? "Kết quả xét nghiệm bình thường"
                          : "Kết quả xét nghiệm cần chú ý"}
                      </div>
                      <div className="text-lg text-gray-600 font-medium">
                        {selectedRecord.testResult?.result}
                        {selectedRecord.testResult?.normal_range && (
                          <span className="text-sm font-normal text-gray-500 ml-2">
                            (Tham chiếu:{" "}
                            {selectedRecord.testResult.normal_range})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className="mb-6">
                    <h4 className="m-0 mb-3 text-lg text-gray-800">
                      {selectedRecord.serviceInfo?.name}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-2 py-2 px-3 bg-gray-100 rounded-full text-sm text-gray-600">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="text-gray-500 text-sm"
                        />
                        {formatDate(selectedRecord.visitDate)}
                      </span>
                      <span className="inline-flex items-center gap-2 py-2 px-3 bg-gray-100 rounded-full text-sm text-gray-600">
                        <FontAwesomeIcon
                          icon={faClock}
                          className="text-gray-500 text-sm"
                        />
                        {selectedRecord.visitTime}
                      </span>
                      <span className="inline-flex items-center gap-2 py-2 px-3 bg-blue-50 rounded-full text-sm text-blue-600">
                        <FontAwesomeIcon
                          icon={faUserMd}
                          className="text-blue-500 text-sm"
                        />
                        Trung tâm GenCare
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-200 flex justify-between items-center flex-wrap gap-4 bg-gray-50">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FontAwesomeIcon icon={faClock} className="text-sm" />
                  <span>
                    Cập nhật gần nhất:{" "}
                    {formatDateTime(
                      selectedRecord.testResult?.created_at ||
                        selectedRecord.created_at
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .modal-overlay,
          .modal-overlay * {
            visibility: visible;
          }
          .modal-overlay {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            background: none !important;
            padding: 0 !important;
          }
          button,
          .footer-actions,
          .result-tabs {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
