import React from 'react';
import classNames from 'classnames/bind';
import styles from '../Appointment.module.scss';

const cx = classNames.bind(styles);

function Header() {
    return (
        <div className={cx('appointment-header')}>
            <h1>📅 Đặt lịch hẹn tư vấn</h1>
            <p>
                Chào mừng bạn! Hãy chọn dịch vụ và thời gian phù hợp.
            </p>
        </div>
    );
}

export default Header;