import React, { useState, useRef, useEffect } from "react";
import { Navbar } from "../../components/ui/Navbar";
import { Footer } from "../../components/Layouts/LayoutHomePage/Footer";
import { useLocation } from "react-router-dom";

const About = () => {
  // Set initial activeTab to null instead of "vision"
  const [activeTab, setActiveTab] = useState(null);
  const contentRef = useRef(null);
  const location = useLocation();

  // Function to handle tab change with scrolling
  const handleTabChange = (tab) => {
    setActiveTab(tab);

    // Scroll to the content section smoothly
    if (contentRef.current) {
      contentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Check URL parameters on component mount
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get("tab");
    if (tab && ["vision", "organization", "recruitment"].includes(tab)) {
      setActiveTab(tab);

      // Only scroll if there's a tab parameter in the URL
      if (contentRef.current) {
        contentRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [location]);

  return (
    <>
      <div>
        <header className="py-2 lg:py-3 sticky top-0 z-10 bg-white shadow-lg">
          <Navbar />
        </header>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Hero section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 mb-12">
          <h1 className="text-4xl font-bold mb-4">Về Chúng Tôi</h1>
          <p className="text-xl">
            GenCare Center - Trung tâm Chăm sóc Sức khỏe và Giáo dục Giới tính
            hàng đầu Việt Nam
          </p>
        </div>

        {/* Service category indicators with arrows */}
        <div className="mb-10 mt-4">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
            Khám phá thêm về GenCare Center
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vision & Mission */}
            <div
              className="text-center cursor-pointer transition-transform hover:-translate-y-2 duration-300"
              onClick={() => handleTabChange("vision")}
            >
              <div
                className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                  activeTab === "vision" ? "bg-blue-600" : "bg-blue-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Tầm nhìn - Sứ mệnh
              </h3>
              <p className="text-gray-600 mb-4">
                Hiểu về mục tiêu và giá trị cốt lõi của chúng tôi
              </p>
              <div className="flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500 animate-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>

            {/* Organization Chart */}
            <div
              className="text-center cursor-pointer transition-transform hover:-translate-y-2 duration-300"
              onClick={() => handleTabChange("organization")}
            >
              <div
                className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                  activeTab === "organization" ? "bg-blue-600" : "bg-blue-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Sơ đồ tổ chức
              </h3>
              <p className="text-gray-600 mb-4">
                Tìm hiểu về cơ cấu và đội ngũ của chúng tôi
              </p>
              <div className="flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500 animate-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>

            {/* Recruitment Info */}
            <div
              className="text-center cursor-pointer transition-transform hover:-translate-y-2 duration-300"
              onClick={() => handleTabChange("recruitment")}
            >
              <div
                className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                  activeTab === "recruitment" ? "bg-blue-600" : "bg-blue-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Thông tin tuyển dụng
              </h3>
              <p className="text-gray-600 mb-4">
                Cơ hội nghề nghiệp và quy trình ứng tuyển
              </p>
              <div className="flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500 animate-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Only show content section if there's an active tab */}
        {activeTab && (
          <div
            ref={contentRef}
            className="bg-white rounded-lg shadow-lg p-8 mb-12"
          >
            {/* Tab navigation */}
            <div className="flex flex-wrap border-b border-gray-200 mb-8">
              <button
                onClick={() => setActiveTab("vision")}
                className={`px-6 py-3 text-lg font-medium rounded-t-lg mr-2 transition duration-300
                  ${
                    activeTab === "vision"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Tầm nhìn - Sứ mệnh
              </button>
              <button
                onClick={() => setActiveTab("organization")}
                className={`px-6 py-3 text-lg font-medium rounded-t-lg mr-2 transition duration-300
                  ${
                    activeTab === "organization"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Sơ đồ tổ chức
              </button>
              <button
                onClick={() => setActiveTab("recruitment")}
                className={`px-6 py-3 text-lg font-medium rounded-t-lg transition duration-300
                  ${
                    activeTab === "recruitment"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Thông tin tuyển dụng
              </button>
            </div>

            {/* Tab content */}
            <div className="tab-content">
              {/* Vision & Mission */}
              {activeTab === "vision" && (
                <div className="vision-mission">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-blue-600 mb-4">
                      Tầm nhìn
                    </h2>
                    <p className="text-lg text-gray-700 mb-6">
                      Trở thành trung tâm hàng đầu trong việc cung cấp dịch vụ
                      chăm sóc sức khỏe giới tính toàn diện và giáo dục giới
                      tính cho mọi lứa tuổi tại Việt Nam, được công nhận bởi
                      chất lượng dịch vụ, đội ngũ chuyên gia uy tín và tác động
                      tích cực đến cộng đồng.
                    </p>
                    <p className="text-lg text-gray-700">
                      Chúng tôi hướng tới việc xóa bỏ các rào cản và định kiến
                      xã hội về vấn đề sức khỏe giới tính, tạo ra một môi trường
                      an toàn và cởi mở để mọi người có thể tiếp cận thông tin
                      và dịch vụ chăm sóc sức khỏe một cách đầy đủ và tự tin.
                    </p>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-blue-600 mb-4">
                      Sứ mệnh
                    </h2>
                    <p className="text-lg text-gray-700 mb-6">
                      Cung cấp dịch vụ chăm sóc sức khỏe giới tính chất lượng
                      cao, đáng tin cậy và toàn diện, đồng thời thúc đẩy giáo
                      dục giới tính khoa học và phù hợp với văn hóa để nâng cao
                      chất lượng cuộc sống và sức khỏe cộng đồng.
                    </p>
                    <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
                      <li>
                        Cung cấp dịch vụ y tế chuyên nghiệp và tôn trọng riêng
                        tư của khách hàng
                      </li>
                      <li>
                        Cung cấp thông tin và kiến thức chính xác, khoa học về
                        sức khỏe giới tính
                      </li>
                      <li>
                        Tạo môi trường an toàn và không phán xét cho mọi đối
                        tượng
                      </li>
                      <li>
                        Đồng hành cùng cộng đồng trong việc xây dựng văn hóa
                        giới tính lành mạnh
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-blue-600 mb-4">
                      Giá trị cốt lõi
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-blue-700 mb-2">
                          Chuyên nghiệp
                        </h3>
                        <p className="text-gray-700">
                          Dịch vụ chuyên môn cao, đội ngũ nhân viên được đào tạo
                          bài bản và luôn cập nhật kiến thức mới.
                        </p>
                      </div>
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-blue-700 mb-2">
                          Tôn trọng
                        </h3>
                        <p className="text-gray-700">
                          Đề cao sự riêng tư, tôn trọng mọi cá nhân không phân
                          biệt giới tính, xu hướng tình dục hay văn hóa.
                        </p>
                      </div>
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-blue-700 mb-2">
                          Thấu hiểu
                        </h3>
                        <p className="text-gray-700">
                          Lắng nghe và thấu hiểu nhu cầu của từng cá nhân để
                          cung cấp dịch vụ phù hợp nhất.
                        </p>
                      </div>
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-blue-700 mb-2">
                          Tin cậy
                        </h3>
                        <p className="text-gray-700">
                          Cung cấp thông tin y khoa chính xác và dịch vụ đáng
                          tin cậy theo tiêu chuẩn quốc tế.
                        </p>
                      </div>
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-blue-700 mb-2">
                          Đổi mới
                        </h3>
                        <p className="text-gray-700">
                          Không ngừng cải tiến dịch vụ và phương pháp giáo dục
                          để đáp ứng nhu cầu ngày càng cao của xã hội.
                        </p>
                      </div>
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-blue-700 mb-2">
                          Trách nhiệm
                        </h3>
                        <p className="text-gray-700">
                          Cam kết với trách nhiệm xã hội và đóng góp tích cực
                          vào việc nâng cao nhận thức cộng đồng.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Organization Chart */}
              {activeTab === "organization" && (
                <div className="organization-chart">
                  <h2 className="text-3xl font-bold text-blue-600 mb-6">
                    Sơ đồ tổ chức
                  </h2>

                  {/* Executive Board */}
                  <div className="mb-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">
                      Ban Điều Hành
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="bg-blue-500 p-4 text-white">
                          <h4 className="text-xl font-semibold">
                            Giám đốc Điều hành
                          </h4>
                        </div>
                        <div className="p-4">
                          <p className="font-semibold">TS. Nguyễn Minh Anh</p>
                          <p className="text-gray-600 mt-2">
                            Quản lý chung và định hướng phát triển cho toàn bộ
                            trung tâm
                          </p>
                        </div>
                      </div>
                      <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="bg-blue-500 p-4 text-white">
                          <h4 className="text-xl font-semibold">
                            Giám đốc Y khoa
                          </h4>
                        </div>
                        <div className="p-4">
                          <p className="font-semibold">PGS.TS Trần Thị Hương</p>
                          <p className="text-gray-600 mt-2">
                            Phụ trách các hoạt động y tế, chuyên môn và đảm bảo
                            chất lượng dịch vụ
                          </p>
                        </div>
                      </div>
                      <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="bg-blue-500 p-4 text-white">
                          <h4 className="text-xl font-semibold">
                            Giám đốc Đào tạo
                          </h4>
                        </div>
                        <div className="p-4">
                          <p className="font-semibold">ThS. Lê Đức Thành</p>
                          <p className="text-gray-600 mt-2">
                            Phụ trách các chương trình đào tạo, giáo dục và
                            truyền thông
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Departments */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">
                      Các Phòng Ban
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="bg-blue-400 p-3 text-white">
                          <h4 className="text-lg font-semibold">
                            Phòng Khám và Tư vấn
                          </h4>
                        </div>
                        <div className="p-4">
                          <p className="text-gray-600">
                            Cung cấp dịch vụ khám, chẩn đoán và tư vấn sức khỏe
                            sinh sản, giới tính
                          </p>
                          <p className="font-semibold mt-2">
                            Trưởng phòng: BS.CKI. Phạm Văn Bình
                          </p>
                        </div>
                      </div>
                      <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="bg-blue-400 p-3 text-white">
                          <h4 className="text-lg font-semibold">
                            Phòng Xét nghiệm
                          </h4>
                        </div>
                        <div className="p-4">
                          <p className="text-gray-600">
                            Thực hiện các xét nghiệm liên quan đến sức khỏe sinh
                            sản và tình dục
                          </p>
                          <p className="font-semibold mt-2">
                            Trưởng phòng: TS. Vũ Minh Đức
                          </p>
                        </div>
                      </div>
                      <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="bg-blue-400 p-3 text-white">
                          <h4 className="text-lg font-semibold">
                            Phòng Giáo dục Cộng đồng
                          </h4>
                        </div>
                        <div className="p-4">
                          <p className="text-gray-600">
                            Tổ chức các hoạt động giáo dục, truyền thông về sức
                            khỏe giới tính
                          </p>
                          <p className="font-semibold mt-2">
                            Trưởng phòng: ThS. Nguyễn Thu Trang
                          </p>
                        </div>
                      </div>
                      <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="bg-blue-400 p-3 text-white">
                          <h4 className="text-lg font-semibold">
                            Phòng Hành chính - Nhân sự
                          </h4>
                        </div>
                        <div className="p-4">
                          <p className="text-gray-600">
                            Quản lý nhân sự, hành chính và các hoạt động vận
                            hành trung tâm
                          </p>
                          <p className="font-semibold mt-2">
                            Trưởng phòng: Cử nhân Trần Minh Tuấn
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h4 className="text-xl font-semibold text-blue-600 mb-3">
                      Quy mô nhân sự:
                    </h4>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Tổng số nhân viên: 45 người</li>
                      <li>Bác sĩ chuyên khoa: 12 người</li>
                      <li>Điều dưỡng và kỹ thuật viên: 15 người</li>
                      <li>Tư vấn viên và giáo dục viên: 10 người</li>
                      <li>Nhân viên hành chính và hỗ trợ: 8 người</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Recruitment Information */}
              {activeTab === "recruitment" && (
                <div className="recruitment-info">
                  <h2 className="text-3xl font-bold text-blue-600 mb-6">
                    Thông tin tuyển dụng
                  </h2>

                  <div className="mb-8">
                    <p className="text-lg text-gray-700 mb-4">
                      Trung tâm GenCare luôn tìm kiếm những ứng viên tài năng,
                      nhiệt huyết để cùng đồng hành trong sứ mệnh nâng cao sức
                      khỏe giới tính và giáo dục giới tính cho cộng đồng.
                    </p>
                    <p className="text-lg text-gray-700">
                      Chúng tôi cung cấp môi trường làm việc chuyên nghiệp, thân
                      thiện và nhiều cơ hội phát triển nghề nghiệp trong lĩnh
                      vực y tế hiện đại.
                    </p>
                  </div>

                  {/* Open Positions */}
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">
                      Vị trí đang tuyển dụng
                    </h3>

                    <div className="space-y-6">
                      <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-xl font-semibold text-blue-700">
                            Bác sĩ Chuyên khoa Sản phụ khoa
                          </h4>
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            Toàn thời gian
                          </span>
                        </div>
                        <div className="mb-3">
                          <p className="text-gray-700 mb-2">
                            <span className="font-semibold">
                              Mô tả công việc:
                            </span>{" "}
                            Khám và điều trị bệnh lý sản phụ khoa, tư vấn sức
                            khỏe sinh sản cho bệnh nhân.
                          </p>
                          <p className="text-gray-700 mb-2">
                            <span className="font-semibold">Yêu cầu:</span> Bác
                            sĩ chuyên khoa I/II về Sản phụ khoa, tối thiểu 3 năm
                            kinh nghiệm.
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Quyền lợi:</span>{" "}
                            Lương từ 30-45 triệu đồng/tháng, BHXH, BHYT, chế độ
                            nghỉ phép, đào tạo chuyên môn định kỳ.
                          </p>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200">
                          Ứng tuyển ngay
                        </button>
                      </div>

                      <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-xl font-semibold text-blue-700">
                            Chuyên viên Tư vấn Tâm lý
                          </h4>
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            Toàn thời gian
                          </span>
                        </div>
                        <div className="mb-3">
                          <p className="text-gray-700 mb-2">
                            <span className="font-semibold">
                              Mô tả công việc:
                            </span>{" "}
                            Tư vấn tâm lý liên quan đến sức khỏe giới tính, hỗ
                            trợ khách hàng giải quyết các vấn đề tâm lý.
                          </p>
                          <p className="text-gray-700 mb-2">
                            <span className="font-semibold">Yêu cầu:</span> Bằng
                            Thạc sĩ Tâm lý học lâm sàng, 2 năm kinh nghiệm tư
                            vấn.
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Quyền lợi:</span>{" "}
                            Lương từ 20-25 triệu đồng/tháng, BHXH, BHYT, môi
                            trường làm việc chuyên nghiệp.
                          </p>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200">
                          Ứng tuyển ngay
                        </button>
                      </div>

                      <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-xl font-semibold text-blue-700">
                            Chuyên viên Giáo dục Cộng đồng
                          </h4>
                          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                            Bán thời gian
                          </span>
                        </div>
                        <div className="mb-3">
                          <p className="text-gray-700 mb-2">
                            <span className="font-semibold">
                              Mô tả công việc:
                            </span>{" "}
                            Tổ chức các hoạt động truyền thông, giáo dục về sức
                            khỏe giới tính tại cộng đồng và trường học.
                          </p>
                          <p className="text-gray-700 mb-2">
                            <span className="font-semibold">Yêu cầu:</span> Tốt
                            nghiệp đại học ngành Y tế công cộng, Giáo dục, Xã
                            hội học hoặc tương đương.
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Quyền lợi:</span>{" "}
                            Lương từ 12-18 triệu đồng/tháng, thời gian linh
                            hoạt, phụ cấp đi lại.
                          </p>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200">
                          Ứng tuyển ngay
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Application Process */}
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">
                      Quy trình ứng tuyển
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                      <div className="bg-gray-50 p-5 rounded-lg">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                          1
                        </div>
                        <h4 className="text-lg font-semibold mb-2">
                          Nộp hồ sơ
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Gửi CV và đơn ứng tuyển qua email hoặc form trực tuyến
                        </p>
                      </div>
                      <div className="bg-gray-50 p-5 rounded-lg">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                          2
                        </div>
                        <h4 className="text-lg font-semibold mb-2">
                          Phỏng vấn sơ bộ
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Phỏng vấn qua điện thoại về kinh nghiệm và kỹ năng
                        </p>
                      </div>
                      <div className="bg-gray-50 p-5 rounded-lg">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                          3
                        </div>
                        <h4 className="text-lg font-semibold mb-2">
                          Phỏng vấn trực tiếp
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Gặp gỡ đội ngũ quản lý và thảo luận chuyên sâu
                        </p>
                      </div>
                      <div className="bg-gray-50 p-5 rounded-lg">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                          4
                        </div>
                        <h4 className="text-lg font-semibold mb-2">
                          Nhận việc
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Thỏa thuận hợp đồng và bắt đầu quá trình làm việc
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-blue-700 mb-3">
                      Thông tin liên hệ:
                    </h3>
                    <p className="mb-2">
                      <span className="font-medium">Email:</span>{" "}
                      careers@gencarecenter.com.vn
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Hotline:</span> 1900 1133
                      (nhấn phím 3 - Phòng Nhân sự)
                    </p>
                    <p>
                      <span className="font-medium">Địa chỉ:</span> Trung tâm
                      GenCare, Số 75 Nguyễn Thông, Phường 9, Quận 3, TP.HCM
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Show a message when no tab is selected */}
        {!activeTab && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Vui lòng chọn một mục để xem thông tin chi tiết
            </h2>
            <p className="text-lg text-gray-600">
              Nhấp vào một trong các mục phía trên để tìm hiểu thêm về GenCare
              Center
            </p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default About;
