import React from 'react';
import classNames from 'classnames/bind';
import styles from '../Appointment.module.scss';

const cx = classNames.bind(styles);

function Header({ isLoggedIn }) {
    return (
        <div className={cx('appointment-header')}>
            <h1>📅 Đặt lịch hẹn tư vấn</h1>
            <p>
                {isLoggedIn
                    ? 'Chào mừng bạn! Hãy chọn dịch vụ và thời gian phù hợp.'
                    : 'Đăng nhập để đặt lịch nhanh chóng hoặc nhập thông tin bên dưới.'
                }
            </p>
        </div>
    );
}

export default Header;