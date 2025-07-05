import React, { useState, useEffect } from 'react';

function EmailPreview() {
    const [scheduledEmails, setScheduledEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);

    useEffect(() => {
        loadScheduledEmails();
        
        // Refresh every 10 seconds
        const interval = setInterval(loadScheduledEmails, 10000);
        return () => clearInterval(interval);
    }, []);

    const loadScheduledEmails = () => {
        const emails = JSON.parse(localStorage.getItem('scheduledEmails') || '[]');
        setScheduledEmails(emails.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate)));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEmailIcon = (type) => {
        return type === 'period' ? '🩸' : '🥚';
    };

    const generatePreviewHTML = (email) => {
        const emoji = email.type === 'period' ? '🩸' : '🥚';
        const bgColor = email.type === 'period' ? '#fecaca' : '#bbf7d0';
        
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 30px 20px; text-align: center;">
                    <h1><span style="font-size: 24px; margin-right: 10px;">${emoji}</span>GenCare - Theo dõi chu kỳ</h1>
                    <p>Thông báo tự động từ ứng dụng quản lý sức khỏe phụ nữ</p>
                </div>
                
                <div style="padding: 30px 20px;">
                    <h2>${email.title}</h2>
                    
                    <div style="background-color: ${bgColor}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
                        <p style="margin: 0; font-size: 16px; line-height: 1.6;">${email.message}</p>
                    </div>
                    
                    <p>Lời khuyên từ chuyên gia:</p>
                    <ul>
                        ${email.type === 'period' ? `
                            <li>Uống đủ nước và nghỉ ngơi hợp lý</li>
                            <li>Sử dụng các sản phẩm vệ sinh phù hợp</li>
                            <li>Thực hiện nhẹ nhàng các bài tập thể dục</li>
                        ` : `
                            <li>Đây là thời điểm thụ thai cao nhất trong chu kỳ</li>
                            <li>Theo dõi các dấu hiệu rụng trứng</li>
                            <li>Tăng cường bổ sung axit folic nếu có kế hoạch mang thai</li>
                        `}
                    </ul>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="#" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                            Mở ứng dụng GenCare
                        </a>
                    </div>
                </div>
                
                <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
                    <p>© 2025 GenCare - Hệ thống quản lý sức khỏe phụ nữ</p>
                    <p>Email này được gửi tự động. Vui lòng không reply email này.</p>
                </div>
            </div>
        `;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📮 Demo Email đã lên lịch</h2>
            
            {scheduledEmails.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">📬</div>
                    <p className="text-gray-600">Chưa có email nào được lên lịch</p>
                    <p className="text-sm text-gray-500 mt-2">Lưu thông tin chu kỳ để xem demo email</p>
                </div>
            ) : (
                <>
                    <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                        {scheduledEmails.map((email) => (
                            <button 
                                key={email.id} 
                                className="w-full text-left border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                onClick={() => setSelectedEmail(email)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <span className="text-xl mr-2">{getEmailIcon(email.type)}</span>
                                            <h4 className="font-semibold text-gray-800">{email.title}</h4>
                                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                                email.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {email.status === 'scheduled' ? 'Đã lên lịch' : 'Đã gửi'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">Gửi tới: {email.email}</p>
                                        <p className="text-xs text-gray-500">
                                            <strong>Lên lịch:</strong> {formatDate(email.scheduledDate)}
                                        </p>
                                    </div>
                                    <span className="text-blue-600 hover:text-blue-800 text-sm">
                                        Xem trước →
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>💡 Lưu ý:</strong> Đây là demo mô phỏng. Trong ứng dụng thực tế, email sẽ được gửi tự động qua dịch vụ như SendGrid, Mailgun hoặc AWS SES.
                        </p>
                    </div>
                </>
            )}

            {/* Email Preview Modal */}
            {selectedEmail && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Preview Email: {selectedEmail.title}
                            </h3>
                            <button
                                onClick={() => setSelectedEmail(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            <div 
                                dangerouslySetInnerHTML={{ 
                                    __html: generatePreviewHTML(selectedEmail) 
                                }}
                            />
                        </div>

                        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
                            <button
                                onClick={() => setSelectedEmail(null)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmailPreview;
