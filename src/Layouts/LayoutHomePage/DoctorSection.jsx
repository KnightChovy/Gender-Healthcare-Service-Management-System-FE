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
            <img
              src="https://images.unsplash.com/photo-1622902046580-2b47f47f5471"
              alt="Bác sĩ Nguyễn Văn A"
              className="w-full h-64 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-bold mb-1">BS. Nguyễn Văn A</h3>
              <p className="text-blue-600 mb-3">Trưởng khoa Nam học</p>
              <p className="text-gray-600 text-sm">
                Hơn 15 năm kinh nghiệm trong lĩnh vực nam khoa và sức khỏe sinh
                sản nam giới.
              </p>
            </div>
          </div>

          {/* Chuyên gia 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1594824476967-48c8b964273f"
              alt="Bác sĩ Trần Thị B"
              className="w-full h-64 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-bold mb-1">BS. Trần Thị B</h3>
              <p className="text-blue-600 mb-3">Chuyên khoa Phụ sản</p>
              <p className="text-gray-600 text-sm">
                Chuyên gia về sức khỏe sinh sản nữ với chứng chỉ quốc tế về tư
                vấn SKSS.
              </p>
            </div>
          </div>

          {/* Chuyên gia 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d"
              alt="ThS. Lê Văn C"
              className="w-full h-64 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-bold mb-1">ThS. Lê Văn C</h3>
              <p className="text-blue-600 mb-3">Chuyên gia tâm lý</p>
              <p className="text-gray-600 text-sm">
                Thạc sĩ Tâm lý học lâm sàng, chuyên tư vấn các vấn đề tâm lý về
                giới tính.
              </p>
            </div>
          </div>

          {/* Chuyên gia 4 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2"
              alt="PGS.TS Hoàng Thị D"
              className="w-full h-64 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-bold mb-1">PGS.TS Hoàng Thị D</h3>
              <p className="text-blue-600 mb-3">Giám đốc chuyên môn</p>
              <p className="text-gray-600 text-sm">
                Phó Giáo sư, Tiến sĩ Y khoa với 25 năm kinh nghiệm trong lĩnh
                vực y tế công cộng.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            to="/team"
            className="inline-flex items-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg shadow-sm transition-colors"
          >
            Xem tất cả chuyên gia
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};