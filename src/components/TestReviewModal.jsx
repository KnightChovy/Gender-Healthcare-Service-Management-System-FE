import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUpload, faCheck } from '@fortawesome/free-solid-svg-icons';

const TestReviewModal = ({ isOpen, onClose, testData, onSubmitReview }) => {
    const [advice, setAdvice] = useState('');
    const [prescriptionFile, setPrescriptionFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !testData) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra loại file (chỉ chấp nhận PDF, DOC, DOCX, JPG, PNG)
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
            if (allowedTypes.includes(file.type)) {
                setPrescriptionFile(file);
            } else {
                alert('Chỉ chấp nhận file PDF, DOC, DOCX, JPG, PNG');
                e.target.value = '';
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!advice.trim()) {
            alert('Vui lòng nhập lời khuyên cho bệnh nhân');
            return;
        }

        setIsSubmitting(true);

        try {
            // Tạo URL giả lập cho file đơn thuốc (trong thực tế sẽ upload lên server)
            let prescriptionUrl = '';
            if (prescriptionFile) {
                prescriptionUrl = `https://hospital-prescriptions.com/prescription/${testData.id}/${prescriptionFile.name}`;
            }

            const reviewData = {
                advice: advice.trim(),
                prescriptionFile: prescriptionFile,
                prescriptionUrl: prescriptionUrl,
                reviewedAt: new Date().toISOString()
            };

            await onSubmitReview(testData.id, reviewData);
            
            // Reset form
            setAdvice('');
            setPrescriptionFile(null);
            onClose();
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Có lỗi xảy ra khi gửi đánh giá!');
        } finally {
            setIsSubmitting(false);
        }
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Xem xét kết quả xét nghiệm
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={isSubmitting}
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Patient Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Thông tin bệnh nhân</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-gray-700">Họ tên:</span>
                                <span className="ml-2 text-sm text-gray-900">{testData.fullName}</span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-700">Loại xét nghiệm:</span>
                                <span className="ml-2 text-sm text-gray-900">{getTestTypeName(testData.testType)}</span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-700">Ngày thực hiện:</span>
                                <span className="ml-2 text-sm text-gray-900">
                                    {testData.testCompletedAt ? new Date(testData.testCompletedAt).toLocaleDateString('vi-VN') : 'N/A'}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-700">Kết quả:</span>
                                <span className={`ml-2 text-sm font-medium ${
                                    testData.resultType === 'good' ? 'text-green-600' : 'text-orange-600'
                                }`}>
                                    {testData.resultType === 'good' ? 'Bình thường' : 'Cần chú ý'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Test Results */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Kết quả xét nghiệm</h3>
                        {testData.testResultData && (
                            <div className="bg-white rounded border p-4">
                                <h4 className="font-medium text-gray-900 mb-2">{testData.testResultData.summary}</h4>
                                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                                    {testData.testResultData.details}
                                </pre>
                            </div>
                        )}
                    </div>

                    {/* Review Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Doctor's Advice */}
                        <div>
                            <label htmlFor="advice" className="block text-sm font-medium text-gray-700 mb-2">
                                Lời khuyên cho bệnh nhân *
                            </label>
                            <textarea
                                id="advice"
                                rows={6}
                                value={advice}
                                onChange={(e) => setAdvice(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập lời khuyên chi tiết cho bệnh nhân dựa trên kết quả xét nghiệm..."
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Prescription File Upload */}
                        <div>
                            <label htmlFor="prescription" className="block text-sm font-medium text-gray-700 mb-2">
                                Đơn thuốc (nếu có)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                <div className="text-center">
                                    <FontAwesomeIcon icon={faUpload} className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="mt-4">
                                        <label htmlFor="prescription" className="cursor-pointer">
                                            <span className="mt-2 block text-sm font-medium text-gray-900">
                                                Tải lên file đơn thuốc
                                            </span>
                                            <span className="mt-1 block text-sm text-gray-500">
                                                PDF, DOC, DOCX, JPG, PNG (tối đa 10MB)
                                            </span>
                                        </label>
                                        <input
                                            id="prescription"
                                            type="file"
                                            className="sr-only"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </div>
                            {prescriptionFile && (
                                <div className="mt-2 p-2 bg-green-50 rounded border">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-green-700">
                                            📄 {prescriptionFile.name} ({(prescriptionFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setPrescriptionFile(null)}
                                            className="text-red-500 hover:text-red-700"
                                            disabled={isSubmitting}
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                                disabled={isSubmitting}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <FontAwesomeIcon icon={faCheck} className="animate-spin mr-2" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                                        Hoàn thành xem xét
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TestReviewModal;
