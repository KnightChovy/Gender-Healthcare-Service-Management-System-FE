import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faCheckCircle,
  faStethoscope,
  faCalendarAlt,
  faUserMd,
  faEye,
  faFileText,
  faSpinner,
  faCalendarCheck,
  faSearch,
  faSortAmountDown,
  faTimesCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../services/axiosClient";

export const MedicalRecord = ({
  medicalRecords,
  medicalLoading,
  setMedicalRecords,
  setMedicalLoading,
  medicalError,
  setMedicalError,
  formatDateTime,
  viewMedicalRecord,
}) => {
  const [filterText, setFilterText] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    let records = [...medicalRecords];

    if (filterText) {
      records = records.filter(
        (record) =>
          record.serviceNames
            .toLowerCase()
            .includes(filterText.toLowerCase()) ||
          record.allResults
            .toLowerCase()
            .includes(filterText.toLowerCase()) ||
          record.allConclusions
            .toLowerCase()
            .includes(filterText.toLowerCase())
      );
    }

    if (sortOrder === "newest") {
      records.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
    } else if (sortOrder === "oldest") {
      records.sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate));
    }

    setFilteredRecords(records);
  }, [medicalRecords, filterText, sortOrder]);

  const fetchTestResults = async () => {
    setMedicalLoading(true);
    setMedicalError(null);

    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axiosClient.get("/v1/users/test-results", {
        headers: {
          "x-access-token": accessToken,
        },
      });

      if (response.data && response.data.status === "success") {
        // Group records by order_id
        const groupedByOrderId = response.data.data.results.reduce((acc, record) => {
          const orderId = record.order_id;
          
          if (!acc[orderId]) {
            acc[orderId] = {
              id: orderId,
              visitDate: record.exam_date,
              visitTime: record.exam_time,
              status: "completed",
              orderInfo: {
                order_id: orderId,
              },
              services: [],
              testResults: [],
              created_at: record.created_at,
            };
          }
          
          // Add service info
          acc[orderId].services.push({
            id: record.service.service_id,
            name: record.service.name,
            description: record.service.description,
            result_wait_time: record.service.result_wait_time,
          });
          
          // Add test result
          acc[orderId].testResults.push({
            id: record.testresult_id,
            service_name: record.service.name,
            result: record.result.result,
            conclusion: record.result.conclusion,
            normal_range: record.result.reference_range,
            created_at: record.result.created_at,
            doctor_note: record.result.doctor_note,
            doctor:
              record.result.doctor &&
              `${record.result.doctor.last_name} ${record.result.doctor.first_name}`,
          });
          
          return acc;
        }, {});

        // Convert grouped data to array
        const formattedRecords = Object.values(groupedByOrderId).map((group) => ({
          ...group,
          // Create summary info for filtering
          serviceNames: group.services.map(s => s.name).join(', '),
          allResults: group.testResults.map(r => r.result).join(', '),
          allConclusions: group.testResults.map(r => r.conclusion).join(', '),
          notes: group.testResults.map(r => r.doctor_note).filter(note => note).join('; ') || "Không có ghi chú",
          treatment: {
            recommendations: [
              "Tiếp tục theo dõi sức khỏe định kỳ",
              "Giữ chế độ ăn uống lành mạnh",
            ],
          },
        }));

        setMedicalRecords(formattedRecords);
      } else {
        setMedicalRecords([]);
      }
    } catch (error) {
      console.error("Error fetching test results:", error);
      setMedicalError(
        error.response?.data?.message ||
          "Không thể tải kết quả xét nghiệm. Vui lòng thử lại sau."
      );
      setMedicalRecords([]);
    } finally {
      setMedicalLoading(false);
    }
  };

  useEffect(() => {
    fetchTestResults();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    return "";
  };

  // Extract conditional rendering logic
  let content = null;

  if (medicalError) {
    content = (
      <div className="flex items-start gap-4 p-6 bg-red-50 rounded-lg border border-red-200 mb-6">
        <div className="text-red-500 text-2xl">
          <FontAwesomeIcon icon={faExclamationTriangle} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-red-800 mb-1">
            Đã xảy ra lỗi
          </h3>
          <p className="text-red-700 mb-3">{medicalError}</p>
          <button
            onClick={fetchTestResults}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <FontAwesomeIcon icon={faSpinner} />
            Thử lại
          </button>
        </div>
      </div>
    );
  } else if (!medicalLoading && medicalRecords.length > 0) {
    content = (
      <>
        <div className="space-y-5">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md"
            >
              {/* ...rest of the record rendering code... */}
              <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="text-blue-500 bg-blue-100 p-2 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-gray-800">
                      {formatDateTime(record.visitDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {record.visitTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span className="text-sm font-medium">Hoàn thành</span>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Đơn xét nghiệm #{record.orderInfo?.order_id}
                  </h3>
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-600">Các dịch vụ đã thực hiện:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {record.services?.map((service, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                          {service.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faUserMd}
                        className="text-blue-500"
                      />
                      <span>
                        <strong>Số lượng dịch vụ:</strong> {record.services?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faStethoscope}
                        className="text-blue-500"
                      />
                      <span>
                        <strong>Số kết quả:</strong> {record.testResults?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Display all test results */}
                <div className="space-y-3">
                  {record.testResults?.map((testResult, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${getResultClass(testResult.conclusion)}`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <FontAwesomeIcon
                          icon={
                            testResult.conclusion
                              ?.toLowerCase()
                              .includes("bình thường")
                              ? faCheckCircle
                              : faInfoCircle
                          }
                          className="text-blue-500"
                        />
                        <h4 className="text-md font-semibold text-gray-800">
                          {testResult.service_name}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="text-gray-700">
                          <strong>Kết quả:</strong>{" "}
                          <span className="font-medium">
                            {testResult.result || "Đang cập nhật"}
                          </span>
                        </div>
                        <div className="text-gray-700">
                          <strong>Kết luận:</strong>{" "}
                          <span className="font-medium">
                            {testResult.conclusion || "Đang cập nhật"}
                          </span>
                        </div>

                        {testResult.normal_range && (
                          <div className="text-gray-700">
                            <strong>Giá trị tham chiếu:</strong>{" "}
                            <span>{testResult.normal_range}</span>
                          </div>
                        )}

                        {testResult.doctor && (
                          <div className="text-gray-700">
                            <strong>Bác sĩ thực hiện:</strong>{" "}
                            <span>{testResult.doctor}</span>
                          </div>
                        )}
                      </div>

                      {testResult.doctor_note && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <strong className="text-gray-700">Ghi chú của bác sĩ:</strong>
                          <p className="text-gray-600 mt-1">{testResult.doctor_note}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    // Pass individual test results in the same format as MyAppointments
                    const formattedResults = record.testResults.map((testResult) => ({
                      testresult_id: testResult.id,
                      exam_date: record.visitDate,
                      exam_time: record.visitTime,
                      service: {
                        name: testResult.service_name,
                        description: record.services.find(s => s.name === testResult.service_name)?.description || '',
                        result_wait_time: record.services.find(s => s.name === testResult.service_name)?.result_wait_time || '',
                      },
                      result: {
                        result: testResult.result,
                        conclusion: testResult.conclusion,
                        normal_range: testResult.normal_range,
                        created_at: testResult.created_at,
                        recommendations: testResult.doctor_note || '',
                      },
                      order_id: record.orderInfo.order_id,
                      doctor: testResult.doctor,
                    }));

                    // Create a detail record that contains individual results
                    const detailRecord = {
                      ...record,
                      // For backward compatibility
                      serviceInfo: {
                        name: record.serviceNames,
                        description: record.services.map(s => s.description).filter(d => d).join('; ') || '',
                        result_wait_time: record.services.map(s => s.result_wait_time).filter(t => t).join(', ') || '',
                      },
                      testResult: {
                        result: record.allResults,
                        conclusion: record.allConclusions,
                        normal_range: record.testResults.map(r => r.normal_range).filter(nr => nr).join('; ') || '',
                        created_at: record.testResults[0]?.created_at,
                        doctor_note: record.notes,
                        doctor: record.testResults.find(r => r.doctor)?.doctor || '',
                      },
                      // Individual results in MyAppointments format
                      individualResults: formattedResults,
                      isGroupedRecord: true,
                      hasMultipleResults: record.testResults.length > 1,
                      totalServices: record.services.length,
                      totalResults: record.testResults.length,
                    };
                    
                    viewMedicalRecord(detailRecord);
                  }}
                >
                  <FontAwesomeIcon icon={faEye} />
                  Xem chi tiết ({record.testResults?.length || 0} kết quả)
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredRecords.length === 0 && filterText && (
          <div className="flex flex-col items-center justify-center py-10">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-gray-400 mb-4"
              size="3x"
            />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Không tìm thấy kết quả phù hợp
            </h3>
            <p className="text-center text-gray-600 mb-4">
              Không tìm thấy kết quả xét nghiệm nào phù hợp với từ khóa "
              {filterText}"
            </p>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setFilterText("")}
            >
              <FontAwesomeIcon icon={faTimesCircle} />
              Xóa bộ lọc
            </button>
          </div>
        )}
      </>
    );
  } else if (!medicalLoading && !medicalError) {
    content = (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="mb-4">
          <FontAwesomeIcon
            icon={faFileText}
            className="text-gray-400"
            size="3x"
          />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Chưa có kết quả xét nghiệm
          </h3>
          <p className="text-gray-600 mb-4">
            Sau khi hoàn thành các lịch hẹn xét nghiệm, kết quả sẽ được hiển
            thị tại đây.
          </p>
          <div>
            <Link
              to="/services/test"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
              Đặt lịch xét nghiệm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-1">
            <FontAwesomeIcon icon={faFileText} className="text-blue-500" />
            Hồ sơ bệnh án & Kết quả xét nghiệm
          </h2>
          <div className="flex items-center gap-3 text-gray-600">
            <span>
              <strong className="text-blue-600">{medicalRecords.length}</strong>
              kết quả xét nghiệm
            </span>
            {medicalLoading && (
              <span className="flex items-center gap-1 text-blue-600">
                <FontAwesomeIcon icon={faSpinner} spin />
                Đang tải...
              </span>
            )}
          </div>
        </div>

        {medicalRecords.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm kiếm kết quả..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-10 pr-10 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {filterText && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setFilterText("")}
                >
                  <FontAwesomeIcon icon={faTimesCircle} />
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="pl-3 pr-10 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
              <FontAwesomeIcon
                icon={faSortAmountDown}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        )}
      </div>

      {content}
    </div>
  );
};
