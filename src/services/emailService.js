// Email notification service simulation
// In a real application, this would be handled by a backend service

export const EmailService = {
    // Simulate sending email
    sendEmail: async (emailData) => {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In real app, this would call an email service API
            const emailPayload = {
                to: emailData.email,
                subject: emailData.title,
                html: generateEmailHTML(emailData),
                scheduledDate: emailData.scheduledDate
            };
            
            return { success: true, data: emailPayload };
            
        } catch (error) {
            console.error('❌ Email sending failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Schedule email to be sent later
    scheduleEmail: (emailData) => {
        const scheduledEmails = JSON.parse(localStorage.getItem('scheduledEmails') || '[]');
        
        const emailToSchedule = {
            id: `email_${Date.now()}`,
            ...emailData,
            status: 'scheduled',
            createdAt: new Date().toISOString()
        };
        
        scheduledEmails.push(emailToSchedule);
        localStorage.setItem('scheduledEmails', JSON.stringify(scheduledEmails));
        
        return emailToSchedule;
    },

    // Check and send due emails (would be called by a cron job in real app)
    processPendingEmails: () => {
        const scheduledEmails = JSON.parse(localStorage.getItem('scheduledEmails') || '[]');
        const now = new Date();
        const emailsToSend = [];
        const remainingEmails = [];

        scheduledEmails.forEach(email => {
            const scheduledDate = new Date(email.scheduledDate);
            if (scheduledDate <= now && email.status === 'scheduled') {
                emailsToSend.push(email);
            } else {
                remainingEmails.push(email);
            }
        });

        // Process emails that are due
        emailsToSend.forEach(email => {
            EmailService.sendEmail(email).then(result => {
                if (result.success) {
                    email.status = 'sent';
                    email.sentAt = new Date().toISOString();
                    remainingEmails.push(email);
                }
            });
        });

        localStorage.setItem('scheduledEmails', JSON.stringify(remainingEmails));
        return emailsToSend;
    }
};

// Generate HTML email template
const generateEmailHTML = (emailData) => {
    const { title, message, type } = emailData;
    const emoji = type === 'period' ? '🩸' : '🥚';
    const bgColor = type === 'period' ? '#fecaca' : '#bbf7d0';
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9fafb; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                .header { background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 30px 20px; text-align: center; }
                .content { padding: 30px 20px; }
                .notification-box { background-color: ${bgColor}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669; }
                .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
                .emoji { font-size: 24px; margin-right: 10px; }
                .btn { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1><span class="emoji">${emoji}</span>GenCare - Theo dõi chu kỳ</h1>
                    <p>Thông báo tự động từ ứng dụng quản lý sức khỏe phụ nữ</p>
                </div>
                
                <div class="content">
                    <h2>${title}</h2>
                    
                    <div class="notification-box">
                        <p style="margin: 0; font-size: 16px; line-height: 1.6;">${message}</p>
                    </div>
                    
                    <p>Lời khuyên từ chuyên gia:</p>
                    <ul>
                        ${type === 'period' ? `
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
                        <a href="http://localhost:5173/menstrual-cycle" class="btn">
                            Mở ứng dụng GenCare
                        </a>
                    </div>
                </div>
                
                <div class="footer">
                    <p>© 2025 GenCare - Hệ thống quản lý sức khỏe phụ nữ</p>
                    <p>Email này được gửi tự động. Vui lòng không reply email này.</p>
                    <p>Để tắt thông báo, vào ứng dụng và thay đổi cài đặt thông báo.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

export default EmailService;
