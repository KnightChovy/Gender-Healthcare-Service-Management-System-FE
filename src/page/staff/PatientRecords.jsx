import React, { useState, useEffect } from "react";
import axiosClient from "../../services/axiosClient";

export const PatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch patient records from API
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      // Replace with actual API endpoint for patient records
      const response = await axiosClient.get("/v1/staff/patients");
      setPatients(response.data.data || []);
      setFilteredPatients(response.data.data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
      // Use mock data for development
      const mockData = [
        {
          id: "BN001",
          patientName: "Nguyễn Văn A",
          age: 28,
          gender: "Nam",
          phone: "0123456789",
          email: "nguyenvana@email.com",
          address: "123 Đường ABC, Quận 1, TP.HCM",
          lastVisit: "20/06/2025",
          totalTests: 3,
          status: "Đang điều trị",
          medicalHistory: [
            {
              date: "20/06/2025",
              diagnosis: "Khám tổng quát",
              doctor: "Bác sĩ Minh",
              treatment: "Theo dõi",
            },
            {
              date: "15/05/2025",
              diagnosis: "Xét nghiệm máu",
              doctor: "Bác sĩ Hương",
              treatment: "Bình thường",
            },
          ],
        },
        {
          id: "BN002",
          patientName: "Trần Thị B",
          age: 32,
          gender: "Nữ",
          phone: "0987654321",
          email: "tranthib@email.com",
          address: "456 Đường XYZ, Quận 3, TP.HCM",
          lastVisit: "21/06/2025",
          totalTests: 5,
          status: "Hoàn thành",
          medicalHistory: [
            {
              date: "21/06/2025",
              diagnosis: "Tư vấn dinh dưỡng",
              doctor: "Bác sĩ Nam",
              treatment: "Hoàn thành",
            },
          ],
        },
        {
          id: "BN003",
          patientName: "Lê Văn C",
          age: 25,
          gender: "Nam",
          phone: "0369852147",
          email: "levanc@email.com",
          address: "789 Đường DEF, Quận 7, TP.HCM",
          lastVisit: "22/06/2025",
          totalTests: 2,
          status: "Đang điều trị",
          medicalHistory: [
            {
              date: "22/06/2025",
              diagnosis: "Xét nghiệm hormone",
              doctor: "Bác sĩ Linh",
              treatment: "Đang theo dõi",
            },
          ],
        },
      ];
      setPatients(mockData);
      setFilteredPatients(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Filter patients based on search criteria
  useEffect(() => {
    let filtered = patients.filter((patient) => {
      const matchesSearch =
        patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGender = genderFilter === "" || patient.gender === genderFilter;
      const matchesStatus = statusFilter === "" || patient.status === statusFilter;

      return matchesSearch && matchesGender && matchesStatus;
    });

    setFilteredPatients(filtered);
  }, [patients, searchTerm, genderFilter, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Đang điều trị":
        return "bg-blue-100 text-blue-800";
      case "Hoàn thành":
        return "bg-green-100 text-green-800";
      case "Tạm dừng":
        return "bg-yellow-100 text-yellow-800";
      case "Hủy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Hồ sơ bệnh nhân
            </h2>
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded transition">
              + Thêm hồ sơ mới
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="Tìm theo tên, mã, SĐT, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Tất cả giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Đang điều trị">Đang điều trị</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Tạm dừng">Tạm dừng</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setGenderFilter("");
                setStatusFilter("");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Đặt lại
            </button>
          </div>

          {/* Results Summary */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Hiển thị {filteredPatients.length} / {patients.length} bệnh nhân
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã BN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin bệnh nhân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tuổi/Giới tính
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lần khám cuối
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số XN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {patient.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium text-gray-900">{patient.patientName}</div>
                        <div className="text-xs text-gray-400">{patient.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.age} / {patient.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>{patient.phone}</div>
                        <div className="text-xs text-gray-400 truncate max-w-32">
                          {patient.address}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.lastVisit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.totalTests}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          patient.status
                        )}`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewPatient(patient)}
                          className="text-cyan-600 hover:text-cyan-900"
                        >
                          Xem
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          Sửa
                        </button>
                        <button className="text-purple-600 hover:text-purple-900">
                          Lịch sử
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Không tìm thấy bệnh nhân nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Patient Detail Modal */}
      {showModal && selectedPatient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết bệnh nhân: {selectedPatient.patientName}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mã bệnh nhân</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPatient.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPatient.patientName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tuổi</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPatient.age}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPatient.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Điện thoại</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPatient.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPatient.email}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPatient.address}</p>
                </div>
              </div>

              {/* Medical History */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Lịch sử khám bệnh</h4>
                <div className="space-y-3">
                  {selectedPatient.medicalHistory?.map((record, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-900">{record.date}</span>
                        <span className="text-sm text-gray-500">{record.doctor}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>Chẩn đoán:</strong> {record.diagnosis}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Điều trị:</strong> {record.treatment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Đóng
                </button>
                <button className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition">
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
