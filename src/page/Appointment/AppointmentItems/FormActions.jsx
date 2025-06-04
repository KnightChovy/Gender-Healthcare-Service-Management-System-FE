import React from 'react'
import classNames from 'classnames/bind';
import styles from '../Appointment.module.scss';

const cx = classNames.bind(styles);

function FormActions({ isSubmitting }) {
    return (  
        <>
            <div className={cx('form-actions')}>
                <button
                    type="submit"
                    className={cx('submit-btn')}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className={cx('loading-spinner')}></span>{" "}
                            Đang đặt lịch...
                        </>
                    ) : (
                        <>
                            📅 Đặt lịch hẹn
                        </>
                    )}
                </button>
            </div>

            <div className={cx('form-notice')}>
                <p>⚡ Lịch hẹn sẽ được xác nhận trong vòng 1-2 giờ</p>
                <p>📞 Hotline hỗ trợ: <strong>1900-1133</strong></p>
                <p>⏰ Thời gian làm việc: 7:30 - 17:00 (T2 - T6)</p>
            </div>
        </>
    );
}

export default FormActions;