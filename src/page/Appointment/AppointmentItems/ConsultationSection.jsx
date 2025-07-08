import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from '../Appointment.module.scss';
import axiosClient from '../../../services/axiosClient';

const cx = classNames.bind(styles);

function ConsultationSection({ formData, errors, onChange }) {
    const location = useLocation();
    const [consultationTypes, setConsultationTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [autoSelectedService, setAutoSelectedService] = useState(null);

    const unhashServiceId = (hashedId) => {
        try {
            return atob(hashedId);
        } catch (error) {
            console.error("Error unhashing serviceId:", error);
            return hashedId;
        }
    };

    const getServiceIdFromUrl = useCallback(() => {
        const urlParams = new URLSearchParams(location.search);
        const hashedServiceId = urlParams.get('serviceId');
        
        if (hashedServiceId) {
            const serviceId = unhashServiceId(hashedServiceId);
            console.log('Service ID from URL:', serviceId);
            return serviceId;
        }
        
        return null;
    }, [location.search]);

    const getIconForService = (serviceName) => {
        const iconMap = {
            'tư vấn giáo dục giới tính cơ bản': '📚',
            'tư vấn tâm lý giới và định hướng tính dục': '🧠',
            'tư vấn quan hệ an toàn và kế hoạch hóa': '💊',
            'tư vấn phòng tránh stis & hiv cho thanh thiếu niên': '🛡️',
            'tư vấn vấn đề giới tính trong mối quan hệ': '💕',
            'tư vấn phụ khoa': '🩺',
        };
        
        const normalizedName = serviceName.toLowerCase().trim();
        return iconMap[normalizedName] || '🩺'; // Default icon
    };

    useEffect(() => {
        const fetchConsultationTypes = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await axiosClient.get('/v1/services');
                
                if (response.data?.success && response.data?.data) {
                    const consultationServices = response.data.data.filter(
                        service => service.category_id === "CAT002"
                    );

                    if (consultationServices.length === 0) {
                        throw new Error('Không tìm thấy dịch vụ tư vấn nào');
                    }

                    const formattedTypes = consultationServices.map(service => ({
                        value: service.name,
                        label: service.name,
                        icon: getIconForService(service.name),
                        service_id: service.service_id,
                        description: service.description,
                        price: parseFloat(service.price || 0),
                        preparation_guidelines: service.preparation_guidelines,
                        result_wait_time: service.result_wait_time
                    }));

                    setConsultationTypes(formattedTypes);

                    const urlServiceId = getServiceIdFromUrl();
                    if (urlServiceId && !formData.consultationType) {
                        const matchingService = formattedTypes.find(
                            service => service.service_id === urlServiceId
                        );
                        
                        if (matchingService) {
                            console.log('Auto-selecting service:', matchingService.label);
                            
                            setAutoSelectedService(matchingService);
                            
                            const syntheticEvent = {
                                target: {
                                    name: 'consultationType',
                                    value: matchingService.value
                                }
                            };
                            
                            onChange(syntheticEvent, matchingService);
                        } else {
                            console.warn('Service ID from URL not found in available services:', urlServiceId);
                        }
                    }
                } else {
                    throw new Error('Không thể tải danh sách loại tư vấn');
                }
            } catch (error) {
                console.error('Error fetching consultation types:', error);
                setError('Không thể tải danh sách loại tư vấn từ server. Vui lòng thử lại.');
                
                setConsultationTypes([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConsultationTypes();
    }, []);

    const handleRetry = () => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await axiosClient.get('/v1/services');
                
                if (response.data?.success && response.data?.data) {
                    const consultationServices = response.data.data.filter(
                        service => service.category_id === "CAT002"
                    );

                    if (consultationServices.length === 0) {
                        throw new Error('Không tìm thấy dịch vụ tư vấn nào');
                    }

                    const formattedTypes = consultationServices.map(service => ({
                        value: service.name,
                        label: service.name,
                        icon: getIconForService(service.name),
                        service_id: service.service_id,
                        description: service.description,
                        price: parseFloat(service.price || 0),
                        preparation_guidelines: service.preparation_guidelines,
                        result_wait_time: service.result_wait_time
                    }));

                    setConsultationTypes(formattedTypes);
                } else {
                    throw new Error('Không thể tải danh sách loại tư vấn');
                }
            } catch (error) {
                console.error('Error retrying fetch:', error);
                setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.');
                setConsultationTypes([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    };

    const formatPrice = (price) => {
        if (!price || price === 0) return 'Liên hệ';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (isLoading) {
        return (
            <div className={cx('form-section', 'consultation-section')}>
                <div className={cx('section-header')}>
                    <h3 className={cx('section-title')}>
                        🩺 Loại tư vấn <span className={cx('required')}>*</span>
                    </h3>
                </div>
                <div className={cx('loading-container')}>
                    <div className={cx('loading-spinner')}></div>
                    <p className={cx('loading-text')}>Đang tải danh sách loại tư vấn...</p>
                </div>
            </div>
        );
    }

    if (error && consultationTypes.length === 0) {
        return (
            <div className={cx('form-section', 'consultation-section')}>
                <div className={cx('section-header')}>
                    <h3 className={cx('section-title')}>
                        🩺 Loại tư vấn <span className={cx('required')}>*</span>
                    </h3>
                </div>
                <div className={cx('error-container')}>
                    <div className={cx('error-icon')}>⚠️</div>
                    <p className={cx('error-text')}>{error}</p>
                    <button 
                        className={cx('retry-btn')} 
                        onClick={handleRetry}
                    >
                        🔄 Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (  
        <div className={cx('form-section', 'consultation-section')}>
            <div className={cx('section-header')}>
                <h3 className={cx('section-title')}>
                    🩺 Loại tư vấn <span className={cx('required')}>*</span>
                </h3>
                <p className={cx('section-subtitle')}>
                    Chọn loại dịch vụ tư vấn phù hợp với nhu cầu của bạn
                </p>
            </div>

            {error && consultationTypes.length > 0 && (
                <div className={cx('warning-message')}>
                    <span className={cx('warning-icon')}>⚠️</span>
                    <span>Đã tải được dữ liệu nhưng có thể không đầy đủ. </span>
                    <button 
                        className={cx('retry-link')} 
                        onClick={handleRetry}
                    >
                        Thử tải lại
                    </button>
                </div>
            )}

            <div className={cx('consultation-grid')}>
                {consultationTypes.map(type => (
                    <label
                        key={type.service_id || type.value}
                        className={cx('consultation-option', {
                            'selected': formData.consultationType === type.value,
                            'error': errors.consultationType
                        })}
                    >
                        <input
                            type="radio"
                            name="consultationType"
                            value={type.value}
                            checked={formData.consultationType === type.value}
                            onChange={(e) => onChange(e, type)}
                            className={cx('consultation-radio')}
                        />
                        
                        <div className={cx('option-content')}>
                            <div className={cx('option-header')}>
                                <span className={cx('option-icon')}>{type.icon}</span>
                                <div className={cx('option-info')}>
                                    <span className={cx('option-title')}>{type.label}</span>
                                    <span className={cx('option-price')}>
                                        {formatPrice(type.price)}
                                    </span>
                                </div>
                            </div>

                            {type.preparation_guidelines && (
                                <div className={cx('option-guidelines')}>
                                    <small className={cx('guidelines-label')}>Chuẩn bị:</small>
                                    <small className={cx('guidelines-text')}>
                                        {type.preparation_guidelines}
                                    </small>
                                </div>
                            )}
                        </div>
                    </label>
                ))}
            </div>

            {errors.consultationType && (
                <div className={cx('error-message')}>
                    <span className={cx('error-icon')}>❌</span>
                    <span>{errors.consultationType}</span>
                </div>
            )}

            <div className={cx('consultation-note')}>
                <span className={cx('note-icon')}>💡</span>
                <p>Phí tư vấn được cập nhật theo giá hiện tại của hệ thống. Thông tin thanh toán chi tiết sẽ được cung cấp sau khi chọn bác sĩ.</p>
            </div>
        </div>
    );
}

export default ConsultationSection;
