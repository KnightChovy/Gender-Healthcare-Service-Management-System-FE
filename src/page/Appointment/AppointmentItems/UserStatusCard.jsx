function UserStatusCard({ isLoggedIn, userProfile, onLogin }) {
    if (isLoggedIn) {
        return (
            <div className="profile-info">
                <div className="profile-card logged-in">
                    <h3>👤 Thông tin từ profile</h3>
                    <div className="profile-details">
                        <p><strong>Họ tên:</strong> {userProfile?.fullName || 'N/A'}</p>
                        <p><strong>Email:</strong> {userProfile?.email || 'N/A'}</p>
                        <p><strong>SĐT:</strong> {userProfile?.phone || 'N/A'}</p>
                    </div>
                    <small>✅ Thông tin này sẽ được sử dụng cho lịch hẹn</small>
                </div>
            </div>
        );
    }

    return (  
        <div className="profile-info">
            <div className="profile-card guest">
                <h3>🔑 Chưa đăng nhập</h3>
                <p>Bạn có thể đăng nhập để đặt lịch nhanh chóng hoặc nhập thông tin bên dưới.</p>
                <button className="login-btn" onClick={onLogin}>
                    Đăng nhập ngay
                </button>
            </div>
        </div>
    );
}

export default UserStatusCard;