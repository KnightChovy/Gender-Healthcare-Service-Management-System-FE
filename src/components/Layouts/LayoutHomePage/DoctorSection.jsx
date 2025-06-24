import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../../services/axiosClient";

export const DoctorSection = () => {
  const [listDoctor, setListDoctor] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApiDoctor = async () => {
      try {
        const res = await axiosClient.get("v1/doctors");
        console.log(res);
        if (res.data.success) {
          setListDoctor(res.data.listAllDoctors);
        } else {
          setError(res.data.message);
        }
      } catch (error) {
        setError(`Loi ket noi: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchApiDoctor();
  }, []);

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
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            listDoctor &&
            listDoctor.slice(0, 4).map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
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
                    {doctor.last_name + " " + doctor.first_name}
                  </h3>
                  <p className="text-blue-600 mb-3">{doctor.bio}</p>
                  <p className="text-gray-600 text-sm">
                    Hơn {doctor.experience_year} năm kinh nghiệm trong lĩnh vực
                    nam khoa và sức khỏe sinh sản nam giới.
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
