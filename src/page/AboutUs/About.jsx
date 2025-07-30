import React, { useState } from "react";
import { Footer } from "../../components/Layouts/LayoutHomePage/Footer";

const About = () => {
  const [activeTab, setActiveTab] = useState("vision");

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        {/* Hero section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 mb-12">
          <h1 className="text-4xl font-bold mb-4">Về Chúng Tôi</h1>
          <p className="text-xl">
            GenCare Center - Trung tâm Chăm sóc Sức khỏe và Giáo dục Giới tính
            hàng đầu Việt Nam
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-wrap border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("vision")}
            className={`px-6 py-3 text-lg font-medium rounded-t-lg mr-2 transition duration-300 ${
              activeTab === "vision"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tầm nhìn - Sứ mệnh
          </button>
          <button
            onClick={() => setActiveTab("organization")}
            className={`px-6 py-3 text-lg font-medium rounded-t-lg mr-2 transition duration-300 ${
              activeTab === "organization"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Sơ đồ tổ chức
          </button>
          <button
            onClick={() => setActiveTab("recruitment")}
            className={`px-6 py-3 text-lg font-medium rounded-t-lg transition duration-300 ${
              activeTab === "recruitment"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Thông tin tuyển dụng
          </button>
        </div>

        {/* Vision & Mission */}
        {activeTab === "vision" && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Tầm nhìn</h2>
            <p className="text-lg text-gray-700 mb-6">
              Trở thành trung tâm hàng đầu trong việc cung cấp dịch vụ chăm sóc
              sức khỏe giới tính toàn diện và giáo dục giới tính cho mọi lứa
              tuổi tại Việt Nam, được công nhận bởi chất lượng dịch vụ, đội ngũ
              chuyên gia uy tín và tác động tích cực đến cộng đồng.
            </p>
            <p className="text-lg text-gray-700">
              Chúng tôi hướng tới việc xóa bỏ các rào cản và định kiến xã hội về
              vấn đề sức khỏe giới tính, tạo ra một môi trường an toàn và cởi mở
              để mọi người có thể tiếp cận thông tin và dịch vụ chăm sóc sức
              khỏe một cách đầy đủ và tự tin.
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-10 mb-4">
              Sứ mệnh
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Cung cấp dịch vụ chăm sóc sức khỏe giới tính chất lượng cao, đáng
              tin cậy và toàn diện, đồng thời thúc đẩy giáo dục giới tính khoa
              học và phù hợp với văn hóa để nâng cao chất lượng cuộc sống và sức
              khỏe cộng đồng.
            </p>
            <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
              <li>
                Dịch vụ y tế chuyên nghiệp và tôn trọng riêng tư khách hàng
              </li>
              <li>
                Thông tin và kiến thức chính xác, khoa học về sức khỏe giới tính
              </li>
              <li>Môi trường an toàn và không phán xét cho mọi đối tượng</li>
              <li>
                Đồng hành cùng cộng đồng trong xây dựng văn hóa giới tính lành
                mạnh
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-blue-600 mt-10 mb-4">
              Giá trị cốt lõi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                [
                  "Chuyên nghiệp",
                  "Dịch vụ chuyên môn cao, nhân viên đào tạo bài bản.",
                ],
                [
                  "Tôn trọng",
                  "Tôn trọng mọi cá nhân, không phân biệt giới tính hay xu hướng tình dục.",
                ],
                [
                  "Thấu hiểu",
                  "Hiểu rõ nhu cầu từng cá nhân để phục vụ tốt nhất.",
                ],
                [
                  "Tin cậy",
                  "Thông tin chính xác, dịch vụ y khoa theo tiêu chuẩn quốc tế.",
                ],
                ["Đổi mới", "Luôn cải tiến dịch vụ và cách tiếp cận giáo dục."],
                ["Trách nhiệm", "Đóng góp vào nâng cao nhận thức cộng đồng."],
              ].map(([title, desc]) => (
                <div key={title} className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">
                    {title}
                  </h3>
                  <p className="text-gray-700">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Organization Chart */}
        {activeTab === "organization" && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-blue-600 mb-6">
              Sơ đồ tổ chức
            </h2>
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">
                Ban Điều Hành
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  [
                    "Giám đốc Điều hành",
                    "TS. Nguyễn Bỉnh Khiêm",
                    "Quản lý chung và định hướng toàn bộ trung tâm",
                  ],
                  [
                    "Giám đốc Y khoa",
                    "PGS.TS Ngô Minh Tân",
                    "Phụ trách chuyên môn, đảm bảo chất lượng dịch vụ",
                  ],
                  [
                    "Giám đốc Đào tạo",
                    "ThS. Phan Tấn Phát",
                    "Phụ trách giáo dục, truyền thông",
                  ],
                ].map(([role, name, desc]) => (
                  <div
                    key={role}
                    className="bg-white shadow-md rounded-lg overflow-hidden"
                  >
                    <div className="bg-blue-500 p-4 text-white">
                      <h4 className="text-xl font-semibold">{role}</h4>
                    </div>
                    <div className="p-4">
                      <p className="font-semibold">{name}</p>
                      <p className="text-gray-600 mt-2">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">
                Các Phòng Ban
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  [
                    "Phòng Khám và Tư vấn",
                    "BS.CKI. Nguyễn Kim Thiên Ngân",
                    "Khám, tư vấn sức khỏe sinh sản",
                  ],
                  [
                    "Phòng Xét nghiệm",
                    "TS. Nguyễn Hoàng Phúc",
                    "Xét nghiệm sức khỏe sinh sản và tình dục",
                  ],
                  [
                    "Phòng Giáo dục Cộng đồng",
                    "ThS. Nguyễn Thị Quỳnh Anh",
                    "Giáo dục, truyền thông cộng đồng",
                  ],
                  [
                    "Phòng Hành chính - Nhân sự",
                    "Cử nhân Lê Công Đức Huy",
                    "Quản lý vận hành trung tâm",
                  ],
                ].map(([dept, head, desc]) => (
                  <div
                    key={dept}
                    className="bg-white shadow-md rounded-lg overflow-hidden"
                  >
                    <div className="bg-blue-400 p-3 text-white">
                      <h4 className="text-lg font-semibold">{dept}</h4>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600">{desc}</p>
                      <p className="font-semibold mt-2">Trưởng phòng: {head}</p>
                    </div>
                  </div>
                ))}
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

        {/* Recruitment Info */}
        {activeTab === "recruitment" && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-blue-600 mb-6">
              Thông tin tuyển dụng
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Trung tâm GenCare luôn tìm kiếm những ứng viên tài năng, nhiệt
              huyết để cùng đồng hành nâng cao sức khỏe giới tính và giáo dục
              cộng đồng.
            </p>
            <p className="text-lg text-gray-700 mb-10">
              Môi trường làm việc chuyên nghiệp, thân thiện, nhiều cơ hội phát
              triển trong lĩnh vực y tế hiện đại.
            </p>

            <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">
              Quy trình ứng tuyển
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              {[
                "Nộp hồ sơ",
                "Phỏng vấn sơ bộ",
                "Phỏng vấn trực tiếp",
                "Nhận việc",
              ].map((step, idx) => (
                <div key={step} className="bg-gray-50 p-5 rounded-lg">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                    {idx + 1}
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{step}</h4>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-6 rounded-lg mt-10">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">
                Thông tin liên hệ:
              </h3>
              <p className="mb-2">
                <span className="font-medium">Email:</span>{" "}
                careers@gencarecenter.com.vn
              </p>
              <p className="mb-2">
                <span className="font-medium">Hotline:</span> 1900 1133 (phím 3
                - Phòng Nhân sự)
              </p>
              <p>
                <span className="font-medium">Địa chỉ:</span> Số 75 Nguyễn
                Thông, P.9, Q.3, TP.HCM
              </p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default About;
