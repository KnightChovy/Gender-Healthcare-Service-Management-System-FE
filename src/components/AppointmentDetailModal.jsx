import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faStar, faPaperclip } from '@fortawesome/free-solid-svg-icons';

const AppointmentDetailModal = ({ isOpen, onClose, item, type, onOpenRating }) => {
    if (!isOpen || !item) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTestTypeName = (testType) => {
        const testTypes = {
            'blood-test': 'Xét nghiệm máu tổng quát',
            'urine-test': 'Xét nghiệm nước tiểu',
            'hormone-test': 'Xét nghiệm hormone',
            'pregnancy-test': 'Xét nghiệm thai',
            'std-test': 'Xét nghiệm bệnh lây truyền qua đường tình dục',
            'fertility-test': 'Xét nghiệm khả năng sinh sản',
            'genetic-test': 'Xét nghiệm di truyền',
            'cancer-screening': 'Tầm soát ung thư',
            'other': 'Khác'
        };
        return testTypes[testType] || testType;
    };

    const getStatusText = (status, type) => {
        if (type === 'test') {
            switch (status) {
                case 0: return 'Đã từ chối';
                case 1: return 'Chờ duyệt';
                case 2: return 'Đã duyệt';
                case 3: return 'Chờ xét nghiệm';
                case 4: return 'Chờ bác sĩ xem xét';
                case 5: return 'Hoàn thành';
                default: return 'Không xác định';
            }
        } else {
            switch (status) {
                case 0: return 'Đã từ chối';
                case 1: return 'Chờ duyệt';
                case 2: return 'Đã duyệt';
                case 3: return 'Đã thanh toán';
                case 4: return 'Hoàn thành';
                default: return 'Không xác định';
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 0: return 'text-red-600 bg-red-100';
            case 1: return 'text-yellow-600 bg-yellow-100';
            case 2: return 'text-blue-600 bg-blue-100';
            case 3: return 'text-green-600 bg-green-100';
            case 4: return 'text-purple-600 bg-purple-100';
            case 5: return 'text-indigo-600 bg-indigo-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Chi tiết {type === 'appointment' ? 'lịch hẹn tư vấn' : 'lịch xét nghiệm'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Trạng thái:</span>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status, type)}
                        </span>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cá nhân</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                                <p className="mt-1 text-sm text-gray-900">{item.fullName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                                <p className="mt-1 text-sm text-gray-900">{item.birthDate}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                                <p className="mt-1 text-sm text-gray-900">{item.gender}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <p className="mt-1 text-sm text-gray-900">{item.phone}</p>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <p className="mt-1 text-sm text-gray-900">{item.email}</p>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                <p className="mt-1 text-sm text-gray-900">{item.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Service Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Thông tin {type === 'appointment' ? 'tư vấn' : 'xét nghiệm'}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {type === 'appointment' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Loại tư vấn</label>
                                        <p className="mt-1 text-sm text-gray-900">{item.consultationType}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ngày đặt lịch</label>
                                        <p className="mt-1 text-sm text-gray-900">{formatDate(item.timestamp)}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Loại xét nghiệm</label>
                                        <p className="mt-1 text-sm text-gray-900">{getTestTypeName(item.testType)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ngày đặt lịch</label>
                                        <p className="mt-1 text-sm text-gray-900">{formatDate(item.timestamp)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ngày mong muốn</label>
                                        <p className="mt-1 text-sm text-gray-900">{item.preferredDate} {item.preferredTime}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Bảo hiểm y tế</label>
                                        <p className="mt-1 text-sm text-gray-900">{item.healthInsurance || 'Không có'}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Medical Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin y tế</h3>
                        <div className="space-y-4">
                            {type === 'appointment' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Triệu chứng</label>
                                        <p className="mt-1 text-sm text-gray-900">{item.symptoms || 'Không có'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tiền sử bệnh</label>
                                        <p className="mt-1 text-sm text-gray-900">{item.medicalHistory || 'Không có'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Thuốc đang dùng</label>
                                        <p className="mt-1 text-sm text-gray-900">{item.currentMedications || 'Không có'}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tiền sử bệnh</label>
                                        <p className="mt-1 text-sm text-gray-900">{item.medicalHistory || 'Không có'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Thuốc đang dùng</label>
                                        <p className="mt-1 text-sm text-gray-900">{item.currentMedications || 'Không có'}</p>
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                                <p className="mt-1 text-sm text-gray-900">{item.note || 'Không có'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Test Result (if applicable) */}
                    {type === 'test' && item.status >= 4 && item.testResult && (
                        <div className="bg-green-50 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Kết quả xét nghiệm</h3>
                            
                            {/* Hiển thị kết quả chi tiết nếu có */}
                            {item.testResultData && (
                                <div className="mb-4 p-4 bg-white rounded border">
                                    <h4 className="font-medium text-gray-900 mb-2">{item.testResultData.summary}</h4>
                                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                                        {item.testResultData.details}
                                    </pre>
                                    {item.resultType && (
                                        <div className="mt-2">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                item.resultType === 'good' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-orange-100 text-orange-800'
                                            }`}>
                                                {item.resultType === 'good' ? 'Kết quả bình thường' : 'Cần chú ý'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={() => window.open(item.testResult, '_blank')}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                            >
                                Tải file kết quả xét nghiệm
                            </button>
                        </div>
                    )}

                    {/* Doctor's Review (for tests with status 5) */}
                    {type === 'test' && item.status === 5 && (
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Nhận xét từ bác sĩ</h3>
                            <div className="space-y-4">
                                {item.doctorAdvice && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Lời khuyên:</label>
                                        <p className="mt-1 text-sm text-gray-900 bg-white p-3 rounded border">
                                            {item.doctorAdvice}
                                        </p>
                                    </div>
                                )}
                                {item.prescriptionUrl && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Đơn thuốc:</label>
                                        <div className="mt-1 bg-white p-3 rounded border">
                                            <a 
                                                href={item.prescriptionUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                <FontAwesomeIcon icon={faPaperclip} className="mr-2" />
                                                Tải xuống đơn thuốc
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {item.prescription && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ghi chú đơn thuốc:</label>
                                        <p className="mt-1 text-sm text-gray-900 bg-white p-3 rounded border">
                                            {item.prescription}
                                        </p>
                                    </div>
                                )}
                                {item.doctorReviewedAt && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Thời gian xem xét:</label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {formatDate(item.doctorReviewedAt)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Payment Information */}
                    {item.status >= 3 && (
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin thanh toán</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Trạng thái thanh toán</label>
                                    <p className="mt-1 text-sm text-green-600 font-medium">Đã thanh toán</p>
                                </div>
                                {item.paidAt && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Thời gian thanh toán</label>
                                        <p className="mt-1 text-sm text-gray-900">{formatDate(item.paidAt)}</p>
                                    </div>
                                )}
                            </div>
                            {type === 'appointment' && item.status === 3 && (
                                <div className="mt-4">
                                    <button
                                        onClick={() => window.open('https://meet.google.com/sqm-jpse-ovb', '_blank')}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Tham gia cuộc họp tư vấn
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Rating Section for completed services */}
                    {((type === 'appointment' && item.status === 4) || (type === 'test' && item.status === 5)) && (
                        <div className="bg-yellow-50 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Đánh giá dịch vụ</h3>
                            {item.rated ? (
                                <div className="text-center">
                                    <p className="text-green-600 font-medium mb-2">
                                        <FontAwesomeIcon icon={faStar} className="mr-2" />
                                        Bạn đã đánh giá dịch vụ này
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Cảm ơn bạn đã dành thời gian đánh giá!
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-gray-700 mb-4">
                                        Dịch vụ đã hoàn thành. Hãy chia sẻ trải nghiệm của bạn!
                                    </p>
                                    <button
                                        onClick={() => {
                                            onOpenRating(item, type);
                                            onClose();
                                        }}
                                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faStar} className="mr-2" />
                                        Đánh giá dịch vụ
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetailModal;
