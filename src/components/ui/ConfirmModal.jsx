import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './ConfirmModal.module.scss';

const cx = classNames.bind(styles);

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Xác nhận',
    message,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    type = 'confirm'
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className={cx('modal-overlay')}>
            <div className={cx('modal-container')}>
                <div className={cx('modal-header')}>
                    <h3 className={cx('modal-title')}>{title}</h3>
                </div>

                <div className={cx('modal-body')}>
                    <p className={cx('modal-message')}>{message}</p>
                </div>

                <div className={cx('modal-footer')}>
                    {type === 'confirm' && (
                        <button
                            className={cx('btn', 'btn-secondary')}
                            onClick={handleCancel}
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        className={cx('btn', 'btn-primary')}
                        onClick={handleConfirm}
                    >
                        {type === 'alert' ? 'OK' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

ConfirmModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func,
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    type: PropTypes.oneOf(['confirm', 'alert'])
};

export default ConfirmModal;
