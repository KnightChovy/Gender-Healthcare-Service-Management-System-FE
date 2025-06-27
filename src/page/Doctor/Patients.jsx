import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import doctorService from "../../services/doctor.service";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    const fetchAppointments = async () => {
      if (user && user.user_id) {
        try {
          // Lấy danh sách bệnh nhân từ các cuộc hẹn của bác sĩ
          const data = await doctorService.fetchDoctorAppointmentsById(
            user.user_id
          );
          // Xử lý dữ liệu để tạo danh sách bệnh nhân duy nhất
          const appointmentsData = data.data || [];
          const uniquePatients = [];
          const patientMap = new Map();
          
          appointmentsData.forEach(appointment => {
            const patientId = appointment.patient_id;
            if (!patientMap.has(patientId)) {
              patientMap.set(patientId, {
                id: patientId,
                name: `${appointment.first_name} ${appointment.last_name}`,
                first_name: appointment.first_name,
                last_name: appointment.last_name,
                phone: appointment.phone || 'Chưa có thông tin',
                gender: appointment.gender || 'Chưa xác định',
                age: appointment.age || 'Chưa có thông tin',
                medicalCondition: appointment.consultant_type || 'Tư vấn chung',
                lastVisit: appointment.appointment_time || new Date().toISOString(),
                visitCount: 1
              });
              uniquePatients.push(patientMap.get(patientId));
            } else {
              // Cập nhật số lần khám
              const existingPatient = patientMap.get(patientId);
              existingPatient.visitCount += 1;
              // Cập nhật lần khám gần nhất nếu cần
              if (new Date(appointment.appointment_time) > new Date(existingPatient.lastVisit)) {
                existingPatient.lastVisit = appointment.appointment_time;
              }
            }
          });
          
          setPatients(uniquePatients);
        } catch (error) {
          console.error("Error fetching appointments:", error);
          setPatients([]); // Set mảng rỗng khi có lỗi
        }
      }
    };

    fetchAppointments();
  }, [user?.user_id]);
  console.log("Patients:", patients);

  // Filter patients based on search term
  const filteredPatients = (patients || []).filter(
    (patient) =>
      (patient.first_name && patient.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.phone && patient.phone.includes(searchTerm)) ||
      (patient.medicalCondition && patient.medicalCondition.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // View patient details
  const viewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Danh sách bệnh nhân
          </h1>
          <div className="mt-4 md:mt-0 w-full md:w-1/3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Tìm kiếm theo tên, SĐT, bệnh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* List of patients */}
        {filteredPatients.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <i className="fas fa-user-slash text-3xl mb-2"></i>
            <p>Không tìm thấy bệnh nhân nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bệnh nhân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tình trạng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lần khám gần nhất
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient, index) => (
                  <tr key={patient.id || `patient-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div
                            className={`h-10 w-10 rounded-full ${
                              patient.gender === "Nữ"
                                ? "bg-pink-100 text-pink-600"
                                : "bg-blue-100 text-blue-600"
                            } flex items-center justify-center`}
                          >
                            {patient.first_name ? patient.first_name.charAt(0) : 'N'}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {patient.first_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patient.gender}, {patient.age} tuổi
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {patient.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {patient.medicalCondition}
                      </div>
                      <div className="text-xs text-gray-500">
                        {patient.visitCount} lần khám
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(patient.lastVisit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => viewPatientDetails(patient)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient details modal */}
      {isModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-medium text-gray-900">
                Thông tin bệnh nhân
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="aspect-square rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-700">
                    {selectedPatient.gender === "Nữ" ? (
                      <i className="fas fa-female"></i>
                    ) : (
                      <i className="fas fa-male"></i>
                    )}
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {selectedPatient.name}
                  </h2>
                  <p className="text-gray-600">ID: #{selectedPatient.id}</p>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center">
                      <div className="w-32 text-gray-500">Giới tính:</div>
                      <div className="text-gray-900">
                        {selectedPatient.gender}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 text-gray-500">Tuổi:</div>
                      <div className="text-gray-900">{selectedPatient.age}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 text-gray-500">Điện thoại:</div>
                      <div className="text-gray-900">
                        {selectedPatient.phone}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 text-gray-500">Số lần khám:</div>
                      <div className="text-gray-900">
                        {selectedPatient.visitCount}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 text-gray-500">Lần khám cuối:</div>
                      <div className="text-gray-900">
                        {formatDate(selectedPatient.lastVisit)}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-32 text-gray-500">Tình trạng:</div>
                      <div className="text-gray-900">
                        {selectedPatient.medicalCondition}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-4">
                <h4 className="text-lg font-medium text-gray-800 mb-4">
                  Lịch sử khám bệnh
                </h4>
                <div className="bg-gray-100 p-4 rounded text-center text-gray-500">
                  Chức năng đang được phát triển
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Đóng
              </button>
              <button className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Hẹn khám
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
