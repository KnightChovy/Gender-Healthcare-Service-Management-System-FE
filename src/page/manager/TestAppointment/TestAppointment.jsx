import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFlaskVial, faEye, faCheck, faPhone, faEnvelope, faFileUpload, faDownload, faCheckCircle, faHourglassHalf,
  faTimesCircle, faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './TestAppointment.module.scss';

const cx = classNames.bind(styles);

// Mock data for testing
const mockTestAppointments = [
  {
    id: 1,
    user_name: 'Nguyễn Văn An',
    user_phone: '0901234567',
    user_email: 'nguyenvanan@email.com',
    test_type: 'Xét nghiệm HIV',
    test_date: '2024-01-15',
    test_time: '08:30:00',
    status: 'pending',
    reference_appointment_id: 'APT001',
    notes: 'Khách hàng cần nhịn ăn 8 tiếng trước khi xét nghiệm',
    created_at: '2024-01-10T09:00:00Z',
    result_summary: null,
    detailed_results: null,
    doctor_notes: null,
    result_file: null
  },
  {
    id: 2,
    user_name: 'Trần Thị Bình',
    user_phone: '0907654321',
    user_email: 'tranthibinh@email.com',
    test_type: 'Xét nghiệm giang mai (RPR)',
    test_date: '2024-01-14',
    test_time: '10:00:00',
    status: 'in_progress',
    reference_appointment_id: 'APT002',
    notes: 'Khách hàng có tiền sử dị ứng thuốc',
    created_at: '2024-01-12T14:30:00Z',
    result_summary: null,
    detailed_results: null,
    doctor_notes: null,
    result_file: null
  },
  {
    id: 3,
    user_name: 'Lê Văn Cường',
    user_phone: '0909876543',
    user_email: 'levanc@email.com',
    test_type: 'Xét nghiệm lậu (PCR)',
    test_date: '2024-01-12',
    test_time: '14:30:00',
    status: 'completed',
    reference_appointment_id: 'APT003',
    notes: 'Tái khám định kỳ 3 tháng',
    created_at: '2024-01-08T11:15:00Z',
    result_summary: 'Kết quả xét nghiệm hormone trong giới hạn bình thường',
    detailed_results: 'TSH: 2.5 mIU/L (bình thường: 0.5-5.0)\nT3: 1.2 ng/mL (bình thường: 0.8-2.0)\nT4: 8.5 μg/dL (bình thường: 5.0-12.0)',
    doctor_notes: 'Kết quả tốt, tiếp tục theo dõi định kỳ',
    result_file: '/files/test-results/result_003.pdf'
  },
  {
    id: 4,
    user_name: 'Phạm Thị Diệu',
    user_phone: '0903456789',
    user_email: 'phamthidieu@email.com',
    test_type: 'Xét nghiệm viêm gan C',
    test_date: '2024-01-16',
    test_time: '09:15:00',
    status: 'pending',
    reference_appointment_id: null,
    notes: null,
    created_at: '2024-01-13T16:45:00Z',
    result_summary: null,
    detailed_results: null,
    doctor_notes: null,
    result_file: null
  },
  {
    id: 5,
    user_name: 'Hoàng Văn Em',
    user_phone: '0905678901',
    user_email: 'hoangvanem@email.com',
    test_type: 'Xét nghiệm HIV',
    test_date: '2024-01-11',
    test_time: '15:00:00',
    status: 'completed',
    reference_appointment_id: 'APT005',
    notes: 'Khách hàng có triệu chứng đau ngực',
    created_at: '2024-01-09T08:20:00Z',
    result_summary: 'Phát hiện bất thường nhẹ, cần theo dõi',
    detailed_results: 'ECG: Nhịp xoang bình thường\nTroponin: 0.02 ng/mL (bình thường < 0.04)\nCholesterol: 220 mg/dL (cao, nên < 200)',
    doctor_notes: 'Khuyên nên thay đổi chế độ ăn uống và tập thể dục',
    result_file: '/files/test-results/result_005.pdf'
  },
  {
    id: 6,
    user_name: 'Vũ Thị Phương',
    user_phone: '0908765432',
    user_email: 'vuthiphuong@email.com',
    test_type: 'Xét nghiệm HPV',
    test_date: '2024-01-17',
    test_time: '07:45:00',
    status: 'in_progress',
    reference_appointment_id: 'APT006',
    notes: 'Khách hàng tiểu đường type 2',
    created_at: '2024-01-14T13:10:00Z',
    result_summary: null,
    detailed_results: null,
    doctor_notes: null,
    result_file: null
  },
  {
    id: 7,
    user_name: 'Đặng Văn Giang',
    user_phone: '0902345678',
    user_email: 'dangvangiang@email.com',
    test_type: 'Xét nghiệm HPV',
    test_date: '2024-01-10',
    test_time: '11:30:00',
    status: 'cancelled',
    reference_appointment_id: 'APT007',
    notes: 'Khách hàng hủy vì lý do cá nhân',
    created_at: '2024-01-07T10:00:00Z',
    result_summary: null,
    detailed_results: null,
    doctor_notes: null,
    result_file: null
  },
  {
    id: 8,
    user_name: 'Ngô Thị Hạnh',
    user_phone: '0906543210',
    user_email: 'ngothihanh@email.com',
    test_type: 'Xét nghiệm giang mai (RPR)',
    test_date: '2024-01-18',
    test_time: '13:15:00',
    status: 'pending',
    reference_appointment_id: 'APT008',
    notes: 'Khám sức khỏe định kỳ',
    created_at: '2024-01-15T09:30:00Z',
    result_summary: null,
    detailed_results: null,
    doctor_notes: null,
    result_file: null
  }
];

export const TestAppointment = () => {
  const [testAppointments, setTestAppointments] = useState(mockTestAppointments);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  
  const [testResults, setTestResults] = useState({
    result_summary: '',
    detailed_results: '',
    doctor_notes: '',
    result_file: null,
    status: 'completed'
  });

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        label: 'Chờ xét nghiệm',
        bgColor: '#fbbf24',
        textColor: '#ffffff',
        icon: faHourglassHalf
      },
      in_progress: {
        label: 'Đang xét nghiệm',
        bgColor: '#3b82f6',
        textColor: '#ffffff',
        icon: faFlaskVial
      },
      completed: {
        label: 'Đã hoàn thành',
        bgColor: '#10b981',
        textColor: '#ffffff',
        icon: faCheckCircle
      },
      cancelled: {
        label: 'Đã hủy',
        bgColor: '#ef4444',
        textColor: '#ffffff',
        icon: faTimesCircle
      }
    };
    return statusMap[status] || statusMap.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Chưa xác định';
    return timeString.slice(0, 5);
  };

  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleResultInputChange = (field, value) => {
    setTestResults(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setTestResults(prev => ({
      ...prev,
      result_file: file
    }));
  };

  const submitTestResults = async () => {
    try {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedAppointments = testAppointments.map(apt => 
        apt.id === selectedAppointment.id 
          ? {
              ...apt,
              status: 'completed',
              result_summary: testResults.result_summary,
              detailed_results: testResults.detailed_results,
              doctor_notes: testResults.doctor_notes,
              result_file: testResults.result_file ? `/files/test-results/result_${apt.id}.pdf` : null
            }
          : apt
      );

      setTestAppointments(updatedAppointments);

      setTestResults({
        result_summary: '',
        detailed_results: '',
        doctor_notes: '',
        result_file: null,
        status: 'completed'
      });

      setShowResultModal(false);
      
      alert('Kết quả xét nghiệm đã được cập nhật và gửi thông báo đến khách hàng!');
    } catch (error) {
      console.error('Error submitting test results:', error);
      alert('Có lỗi xảy ra khi cập nhật kết quả xét nghiệm');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedAppointments = testAppointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      );
      
      setTestAppointments(updatedAppointments);
      
      alert(`Trạng thái đã được cập nhật thành: ${getStatusInfo(newStatus).label}`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  return (
    <div className={cx('test-appointments-page')}>
      {/* Simple Table Container */}
      <div className={cx('table-container')}>
        <div className={cx('table-wrapper')}>
          <table className={cx('appointments-table')}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Trạng thái</th>
                <th>Khách hàng</th>
                <th>Loại xét nghiệm</th>
                <th>Thời gian xét nghiệm</th>
                <th>Mã tư vấn</th>
                <th>Ngày đặt</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {testAppointments.map((appointment, index) => {
                const statusInfo = getStatusInfo(appointment.status);

                return (
                  <tr key={appointment.id} className={cx('table-row')}>
                    {/* STT */}
                    <td className={cx('stt-cell')}>{index + 1}</td>

                    {/* Status */}
                    <td className={cx('status-cell')}>
                      <span 
                        className={cx('status-badge')} 
                        style={{
                          backgroundColor: statusInfo.bgColor,
                          color: statusInfo.textColor
                        }}
                      >
                        <FontAwesomeIcon icon={statusInfo.icon} />
                        {statusInfo.label}
                      </span>
                    </td>

                    {/* Customer Info - Bao gồm cả thông tin liên hệ */}
                    <td className={cx('customer-cell')}>
                      <div className={cx('customer-info')}>
                        <div className={cx('customer-name')}>
                          <strong>{appointment.user_name}</strong>
                        </div>
                        <div className={cx('contact-info')}>
                          <div><FontAwesomeIcon icon={faPhone} /> {appointment.user_phone}</div>
                          <div><FontAwesomeIcon icon={faEnvelope} /> {appointment.user_email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Test Type */}
                    <td className={cx('test-type-cell')}>
                      {appointment.test_type}
                    </td>

                    {/* Test DateTime - Gộp ngày và giờ */}
                    <td className={cx('datetime-cell')}>
                      <div className={cx('datetime-info')}>
                        <div className={cx('date-part')}>{formatDate(appointment.test_date)}</div>
                        <div className={cx('time-part')}>{formatTime(appointment.test_time)}</div>
                      </div>
                    </td>

                    {/* Reference ID */}
                    <td className={cx('reference-cell')}>
                      {appointment.reference_appointment_id ? (
                        <span className={cx('reference-id')}>
                          #{appointment.reference_appointment_id}
                        </span>
                      ) : (
                        <span className={cx('no-reference')}>-</span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className={cx('created-cell')}>
                      {formatDate(appointment.created_at)}
                    </td>

                    {/* Actions */}
                    <td className={cx('actions-cell')}>
                      <div className={cx('action-buttons')}>
                        <button
                          className={cx('action-btn', 'view-btn')}
                          onClick={() => viewAppointmentDetails(appointment)}
                          title="Xem chi tiết"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>

                        {appointment.status === 'pending' && (
                          <button
                            className={cx('action-btn', 'progress-btn')}
                            onClick={() => updateAppointmentStatus(appointment.id, 'in_progress')}
                            title="Bắt đầu xét nghiệm"
                          >
                            <FontAwesomeIcon icon={faFlaskVial} />
                          </button>
                        )}

                        {appointment.status === 'in_progress' && (
                          <button
                            className={cx('action-btn', 'result-btn')}
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowResultModal(true);
                            }}
                            title="Nhập kết quả"
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                        )}

                        {appointment.status === 'completed' && appointment.result_file && (
                          <button
                            className={cx('action-btn', 'download-btn')}
                            onClick={() => window.open(appointment.result_file, '_blank')}
                            title="Tải kết quả"
                          >
                            <FontAwesomeIcon icon={faDownload} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedAppointment && (
        <div className={cx('modal-overlay')} onClick={() => setShowModal(false)}>
          <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
            <div className={cx('modal-header')}>
              <h2>Chi tiết lịch xét nghiệm</h2>
              <button className={cx('close-btn')} onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className={cx('modal-body')}>
              <div className={cx('detail-grid')}>
                <div className={cx('detail-row')}>
                  <strong>Trạng thái:</strong>
                  <span className={cx('status-text')}>
                    {getStatusInfo(selectedAppointment.status).label}
                  </span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Họ tên khách hàng:</strong>
                  <span>{selectedAppointment.user_name}</span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Số điện thoại:</strong>
                  <span>{selectedAppointment.user_phone}</span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Email:</strong>
                  <span>{selectedAppointment.user_email}</span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Loại xét nghiệm:</strong>
                  <span>{selectedAppointment.test_type}</span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Ngày xét nghiệm:</strong>
                  <span>{formatDate(selectedAppointment.test_date)}</span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Giờ xét nghiệm:</strong>
                  <span>{formatTime(selectedAppointment.test_time)}</span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Ngày đặt lịch:</strong>
                  <span>{formatDate(selectedAppointment.created_at)}</span>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className={cx('notes-info')}>
                  <h3>Ghi chú</h3>
                  <p>{selectedAppointment.notes}</p>
                </div>
              )}

              {selectedAppointment.result_summary && (
                <div className={cx('result-info')}>
                  <h3>Kết quả xét nghiệm</h3>
                  <div className={cx('result-item')}>
                    <strong>Tóm tắt kết quả:</strong>
                    <p>{selectedAppointment.result_summary}</p>
                  </div>
                  {selectedAppointment.detailed_results && (
                    <div className={cx('result-item')}>
                      <strong>Chi tiết kết quả:</strong>
                      <p style={{whiteSpace: 'pre-line'}}>{selectedAppointment.detailed_results}</p>
                    </div>
                  )}
                  {selectedAppointment.doctor_notes && (
                    <div className={cx('result-item')}>
                      <strong>Ghi chú của bác sĩ:</strong>
                      <p>{selectedAppointment.doctor_notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Result Input Modal */}
      {showResultModal && selectedAppointment && (
        <div className={cx('modal-overlay')} onClick={() => setShowResultModal(false)}>
          <div className={cx('modal-content', 'result-modal')} onClick={(e) => e.stopPropagation()}>
            <div className={cx('modal-header')}>
              <h2>Nhập kết quả xét nghiệm</h2>
              <button className={cx('close-btn')} onClick={() => setShowResultModal(false)}>×</button>
            </div>

            <div className={cx('modal-body')}>
              <div className={cx('patient-summary')}>
                <h3>Thông tin khách hàng</h3>
                <p><strong>Họ tên:</strong> {selectedAppointment.user_name}</p>
                <p><strong>Loại xét nghiệm:</strong> {selectedAppointment.test_type}</p>
                <p><strong>Ngày xét nghiệm:</strong> {formatDate(selectedAppointment.test_date)}</p>
              </div>

              <div className={cx('result-form')}>
                <div className={cx('form-group')}>
                  <label htmlFor="detailed_results">Chi tiết kết quả</label>
                  <textarea
                    id="detailed_results"
                    value={testResults.detailed_results}
                    onChange={(e) => handleResultInputChange('detailed_results', e.target.value)}
                    placeholder="Nhập chi tiết kết quả xét nghiệm..."
                    rows={5}
                  />
                </div>

                <div className={cx('form-group')}>
                  <label htmlFor="result_summary">Tóm tắt kết quả *</label>
                  <textarea
                    id="result_summary"
                    value={testResults.result_summary}
                    onChange={(e) => handleResultInputChange('result_summary', e.target.value)}
                    placeholder="Nhập tóm tắt kết quả xét nghiệm..."
                    rows={3}
                    required
                  />
                </div>

                <div className={cx('form-group')}>
                  <label htmlFor="doctor_notes">Ghi chú của bác sĩ</label>
                  <textarea
                    id="doctor_notes"
                    value={testResults.doctor_notes}
                    onChange={(e) => handleResultInputChange('doctor_notes', e.target.value)}
                    placeholder="Nhập ghi chú, khuyến nghị của bác sĩ..."
                    rows={3}
                  />
                </div>

                <div className={cx('form-group')}>
                  <label htmlFor="severity">Mức độ</label>
                  <select
                    id="severity"
                    value={testResults.severity}
                    onChange={(e) => handleResultInputChange('severity', e.target.value)}
                    className={cx('severity-select')}
                  >
                    <option value="">Chọn mức độ</option>
                    <option value="moderate">Vừa</option>
                    <option value="severe">Nặng</option>
                  </select>
                </div>
              </div>

              <div className={cx('modal-actions')}>
                <button
                  className={cx('cancel-btn')}
                  onClick={() => setShowResultModal(false)}
                >
                  Hủy
                </button>
                <button
                  className={cx('submit-btn')}
                  onClick={submitTestResults}
                  disabled={!testResults.result_summary.trim()}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Gửi kết quả
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
