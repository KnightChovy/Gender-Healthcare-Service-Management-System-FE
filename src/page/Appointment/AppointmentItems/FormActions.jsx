import React from 'react'

function FormActions({ isSubmitting }) {
    return (  
        <>
            <div className="form-actions">
                <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="loading-spinner"></span>{" "}
                            Đang đặt lịch...
                        </>
                    ) : (
                        <>
                            📅 Đặt lịch hẹn
                        </>
                    )}
                </button>
            </div>

            <div className="form-note">
                <p>⚡ Lịch hẹn sẽ được xác nhận trong vòng 1-2 giờ</p>
                <p>📞 Hotline hỗ trợ: <strong>1900-1133</strong></p>
                <p>⏰ Thời gian làm việc: 7:30 - 17:00 (T2 - T6)</p>
            </div>
        </>
    );
}

export default FormActions;