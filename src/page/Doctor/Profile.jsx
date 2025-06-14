import React, { useState } from "react";

// Mock doctor data
const mockDoctorData = {
  id: "DR0123",
  name: "Nguyễn Thị Minh",
  email: "nguyen.minh@healthcare.com",
  phone: "0901234567",
  dob: "1985-08-15",
  gender: "Nữ",
  specialty: "Khoa Phụ sản",
  experience: "12 năm",
  education: "Đại học Y Hà Nội",
  certifications: [
    "Chứng chỉ hành nghề bác sĩ chuyên khoa sản",
    "Chứng nhận tư vấn dinh dưỡng thai kỳ",
    "Chứng nhận siêu âm 4D",
  ],
  avatar: "https://via.placeholder.com/150",
  bio: "Bác sĩ Nguyễn Thị Minh có hơn 12 năm kinh nghiệm trong lĩnh vực sản khoa và chăm sóc sức khỏe phụ nữ. Chuyên môn sâu về theo dõi thai kỳ, siêu âm 4D và tư vấn dinh dưỡng cho mẹ và bé.",
  address: "123 Đường Trường Chinh, Quận Đống Đa, Hà Nội",
};

const Profile = () => {
  const [doctor, setDoctor] = useState(mockDoctorData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDoctor, setEditedDoctor] = useState({ ...mockDoctorData });
  const [activeTab, setActiveTab] = useState("info");
  const [newCert, setNewCert] = useState("");

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDoctor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add certification
  const handleAddCertification = () => {
    if (newCert.trim()) {
      setEditedDoctor((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCert.trim()],
      }));
      setNewCert("");
    }
  };

  // Remove certification
  const handleRemoveCertification = (index) => {
    setEditedDoctor((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setDoctor({ ...editedDoctor });
    setIsEditing(false);
    alert("Thông tin đã được cập nhật thành công!");
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6 rounded-t-lg">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
          <div className="h-24 w-24 rounded-full bg-white p-1 flex-shrink-0">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="md:ml-6 flex-1">
            <h1 className="text-2xl font-semibold">BS. {doctor.name}</h1>
            <p>{doctor.specialty}</p>
            <p className="text-sm text-blue-100">ID: {doctor.id}</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isEditing}
              className="px-4 py-2 bg-white text-blue-700 rounded-md shadow-sm hover:bg-blue-50 disabled:opacity-50"
            >
              <i className="fas fa-edit mr-2"></i>
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === "info"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === "schedule"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Lịch làm việc
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === "stats"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Thống kê
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "info" && (
          <div>
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editedDoctor.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editedDoctor.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editedDoctor.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={editedDoctor.dob}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Giới tính
                    </label>
                    <select
                      name="gender"
                      value={editedDoctor.gender}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Chuyên khoa
                    </label>
                    <input
                      type="text"
                      name="specialty"
                      value={editedDoctor.specialty}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Kinh nghiệm
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={editedDoctor.experience}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Học vấn
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={editedDoctor.education}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={editedDoctor.address}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Giới thiệu
                    </label>
                    <textarea
                      name="bio"
                      rows="3"
                      value={editedDoctor.bio}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    ></textarea>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chứng chỉ
                    </label>
                    <div className="space-y-2">
                      {editedDoctor.certifications.map((cert, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                        >
                          <span className="text-sm">{cert}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCertification(index)}
                            className="text-red-500"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex">
                      <input
                        type="text"
                        value={newCert}
                        onChange={(e) => setNewCert(e.target.value)}
                        placeholder="Thêm chứng chỉ mới"
                        className="block w-full border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleAddCertification}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditedDoctor({ ...doctor });
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                    Thông tin cá nhân
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p>{doctor.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        Số điện thoại:
                      </span>
                      <p>{doctor.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Ngày sinh:</span>
                      <p>{new Date(doctor.dob).toLocaleDateString("vi-VN")}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Giới tính:</span>
                      <p>{doctor.gender}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-sm text-gray-500">Địa chỉ:</span>
                      <p>{doctor.address}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                    Thông tin chuyên môn
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">
                        Chuyên khoa:
                      </span>
                      <p>{doctor.specialty}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        Kinh nghiệm:
                      </span>
                      <p>{doctor.experience}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-sm text-gray-500">Học vấn:</span>
                      <p>{doctor.education}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-sm text-gray-500">Giới thiệu:</span>
                      <p className="mt-1">{doctor.bio}</p>
                    </div>
                  </div>
                </div>

                {/* Certificates */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                    Chứng chỉ
                  </h2>
                  <ul className="list-disc pl-5 space-y-1">
                    {doctor.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="text-center py-10">
            <i className="fas fa-calendar-alt text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-500">
              Quản lý lịch làm việc của bạn tại mục "Đăng ký lịch làm việc"
              trong menu.
            </p>
            <button
              onClick={() => (window.location.href = "/doctor/schedule")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Đi đến Đăng ký lịch làm việc
            </button>
          </div>
        )}

        {activeTab === "stats" && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Thống kê hoạt động
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-3 mr-4">
                    <i className="fas fa-check-circle text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-800">
                      142
                    </div>
                    <div className="text-sm text-gray-600">
                      Lịch hẹn đã hoàn thành
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <i className="fas fa-user-friends text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-800">
                      98
                    </div>
                    <div className="text-sm text-gray-600">
                      Bệnh nhân đã khám
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full p-3 mr-4">
                    <i className="fas fa-star text-purple-600 text-xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-800">
                      4.8/5
                    </div>
                    <div className="text-sm text-gray-600">
                      Đánh giá trung bình
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Hoạt động theo tháng
              </h3>
              <div className="h-80 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">
                  Biểu đồ thống kê đang được phát triển
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Dịch vụ phổ biến
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Khám thai định kỳ</span>
                    <span>60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Siêu âm 4D</span>
                    <span>25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Tư vấn dinh dưỡng</span>
                    <span>15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "15%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
