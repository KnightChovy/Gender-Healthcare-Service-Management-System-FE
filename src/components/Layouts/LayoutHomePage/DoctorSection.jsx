import React from "react";
import { Link } from "react-router-dom";

export const DoctorSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Đội ngũ chuyên gia
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Đội ngũ y bác sĩ giàu kinh nghiệm, được đào tạo chuyên sâu về sức
            khỏe giới tính
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Chuyên gia 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-1">
                PGS.TS Nguyễn Minh Tuấn
              </h3>
              <p className="text-blue-600 mb-3">Trưởng khoa Nam học</p>
              <p className="text-gray-600 text-sm">
                Hơn 15 năm kinh nghiệm trong lĩnh vực nam khoa và sức khỏe sinh
                sản nam giới.
              </p>
            </div>
          </div>

          {/* Chuyên gia 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-1">
                TS.BS Trần Thị Phương Linh
              </h3>
              <p className="text-blue-600 mb-3">Chuyên khoa Phụ sản</p>
              <p className="text-gray-600 text-sm">
                Chuyên gia về sức khỏe sinh sản nữ với chứng chỉ quốc tế về tư
                vấn SKSS.
              </p>
            </div>
          </div>

          {/* Chuyên gia 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-1">ThS. Lê Thành Đạt</h3>
              <p className="text-blue-600 mb-3">Chuyên gia tâm lý</p>
              <p className="text-gray-600 text-sm">
                Thạc sĩ Tâm lý học lâm sàng, chuyên tư vấn các vấn đề tâm lý về
                giới tính.
              </p>
            </div>
          </div>

          {/* Chuyên gia 4 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-1">
                PGS.TS Hoàng Thị Mai Phương
              </h3>
              <p className="text-blue-600 mb-3">Giám đốc chuyên môn</p>
              <p className="text-gray-600 text-sm">
                Phó Giáo sư, Tiến sĩ Y khoa với 25 năm kinh nghiệm trong lĩnh
                vực y tế công cộng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
