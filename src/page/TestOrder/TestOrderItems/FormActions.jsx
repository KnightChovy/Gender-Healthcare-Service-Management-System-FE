import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlask, faPhone, faClock, faBolt } from '@fortawesome/free-solid-svg-icons';

function FormActions({ isSubmitting }) {
    return (
        <>
            {/* Submit Button Section */}
            <div className="flex justify-center pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg rounded-xl shadow-lg transition-all duration-300 transform min-w-[250px] ${
                        isSubmitting 
                            ? 'opacity-75 cursor-not-allowed' 
                            : 'hover:from-purple-700 hover:to-pink-700 hover:shadow-xl hover:scale-105'
                    }`}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                            <FontAwesomeIcon icon={faFlask} className="animate-pulse" />
                            <span>Đang đặt lịch xét nghiệm...</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center space-x-2">
                            <FontAwesomeIcon icon={faFlask} />
                            <span>Đặt Lịch Xét Nghiệm</span>
                        </div>
                    )}
                </button>
            </div>

            {/* Notice Section */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faBolt} className="text-yellow-500" />
                        <p>Lịch xét nghiệm sẽ được xác nhận trong vòng <strong className="text-purple-600">1-2 giờ</strong></p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faPhone} className="text-green-500" />
                        <p>
                            Hotline hỗ trợ: 
                            <a 
                                href="tel:19001133" 
                                className="font-bold text-blue-600 hover:text-blue-700 hover:underline ml-1 transition-colors"
                            >
                                1900-1133
                            </a>
                        </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faClock} className="text-purple-500" />
                        <p>
                            Thời gian làm việc: 
                            <strong className="text-purple-600 ml-1">7:30 - 17:00 (T2 - T6)</strong>
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faFlask} className="text-blue-500" />
                        <p>
                            Xét nghiệm máu: 
                            <strong className="text-blue-600 ml-1">Nhịn ăn 8-12 tiếng trước</strong>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

FormActions.propTypes = {
    isSubmitting: PropTypes.bool.isRequired,
};

export default FormActions;
