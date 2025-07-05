import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../Layouts/LayoutHomePage/Navbar';
import { Footer } from '../../Layouts/LayoutHomePage/Footer';

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadPaymentData = useCallback(() => {
    try {
      // Tìm appointment hoặc test order cần thanh toán
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const testOrders = JSON.parse(localStorage.getItem('testOrders') || '[]');
      
      const appointment = appointments.find(apt => apt.id === id && apt.status === 2);
      const testOrder = testOrders.find(test => test.id === id && test.status === 2);
      
      if (appointment) {
        setPaymentData({
          ...appointment,
          type: 'appointment',
          amount: 500000,
          serviceName: 'Lịch hẹn tư vấn'
        });
      } else if (testOrder) {
        const testPrices = {
          'blood-test': 300000,
          'urine-test': 200000,
          'hormone-test': 800000,
          'std-test': 1200000,
          'general-checkup': 1500000
        };
        
        setPaymentData({
          ...testOrder,
          type: 'test',
          amount: testPrices[testOrder.testType] || 500000,
          serviceName: 'Lịch xét nghiệm'
        });
      } else {
        // Không tìm thấy hoặc đã thanh toán
        navigate('/');
        return;
      }
    } catch (error) {
      console.error('Error loading payment data:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadPaymentData();
  }, [id, loadPaymentData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update status to confirmed & paid (status = 3)
      if (paymentData.type === 'appointment') {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const updatedAppointments = appointments.map(apt =>
          apt.id === id ? { ...apt, status: 3, paidAt: new Date().toISOString() } : apt
        );
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      } else {
        const testOrders = JSON.parse(localStorage.getItem('testOrders') || '[]');
        const updatedTestOrders = testOrders.map(test =>
          test.id === id ? { ...test, status: 3, paidAt: new Date().toISOString() } : test
        );
        localStorage.setItem('testOrders', JSON.stringify(updatedTestOrders));
      }
      
      // Create success notification based on service type
      let notification;
      if (paymentData.type === 'appointment') {
        // For consultation appointments
        const meetLink = 'https://meet.google.com/sqm-jpse-ovb';
        notification = {
          id: `PAYMENT_SUCCESS_${Date.now()}`,
          type: 'payment-success',
          title: 'Thanh toán thành công - Lịch hẹn khám',
          message: `Bạn đã thanh toán thành công ${formatCurrency(paymentData.amount)} cho ${paymentData.serviceName}. Link tư vấn: ${meetLink}`,
          timestamp: new Date().toISOString(),
          read: false,
          meetLink: meetLink
        };
      } else {
        // For test orders
        notification = {
          id: `PAYMENT_SUCCESS_${Date.now()}`,
          type: 'payment-success',
          title: 'Đặt lịch xét nghiệm thành công',
          message: `Bạn đã đặt lịch xét nghiệm thành công. Phí xét nghiệm: ${formatCurrency(paymentData.amount)}. Vui lòng đến cơ sở y tế đúng giờ hẹn và nhớ mang theo giấy tờ tùy thân.`,
          timestamp: new Date().toISOString(),
          read: false,
          testInstructions: 'Lưu ý: Nhịn ăn 8-12 tiếng trước khi xét nghiệm máu (nếu có). Mang theo CCCD/CMND và giấy chỉ định xét nghiệm.'
        };
      }
      
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.unshift(notification);
      localStorage.setItem('notifications', JSON.stringify(notifications));
      
      // Show success message based on service type
      if (paymentData.type === 'appointment') {
        if (window.confirm(`Thanh toán thành công! Bạn có muốn tham gia cuộc họp tư vấn ngay bây giờ?`)) {
          window.open(notification.meetLink, '_blank');
        }
      } else {
        alert(`Đặt lịch xét nghiệm thành công!\n\nLưu ý quan trọng:\n- Nhịn ăn 8-12 tiếng trước khi xét nghiệm máu (nếu có)\n- Mang theo CCCD/CMND và giấy chỉ định\n- Đến đúng giờ hẹn tại cơ sở y tế\n\nChúc bạn sức khỏe!`);
      }
      navigate('/');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Có lỗi xảy ra trong quá trình thanh toán!');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin thanh toán...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-600">Không tìm thấy thông tin thanh toán</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-pink-600 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold text-center">Thanh toán dịch vụ</h1>
            <p className="text-center mt-2 opacity-90">Hoàn tất thanh toán để xác nhận dịch vụ</p>
          </div>

          {/* Payment Details */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin dịch vụ</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Dịch vụ:</span>
                  <span className="font-medium">{paymentData.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Khách hàng:</span>
                  <span className="font-medium">{paymentData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số điện thoại:</span>
                  <span className="font-medium">{paymentData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đặt:</span>
                  <span className="font-medium">
                    {new Date(paymentData.timestamp).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t">
                  <span>Tổng tiền:</span>
                  <span className="text-green-600">{formatCurrency(paymentData.amount)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Phương thức thanh toán</h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Chuyển khoản ngân hàng</div>
                    <div className="text-sm text-gray-500">Chuyển khoản qua ATM hoặc Internet Banking</div>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="momo"
                    checked={paymentMethod === 'momo'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Ví MoMo</div>
                    <div className="text-sm text-gray-500">Thanh toán qua ví điện tử MoMo</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Thanh toán tại cơ sở</div>
                    <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi đến khám</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Bank Info (if bank transfer selected) */}
            {paymentMethod === 'bank' && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Thông tin chuyển khoản</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Ngân hàng:</strong> Vietcombank</p>
                  <p><strong>Số tài khoản:</strong> 1234567890</p>
                  <p><strong>Chủ tài khoản:</strong> TRUNG TAM GENCARE</p>
                  <p><strong>Nội dung:</strong> {paymentData.serviceName} {paymentData.id}</p>
                </div>
              </div>
            )}

            {/* Payment Button */}
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:from-blue-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  `Thanh toán ${formatCurrency(paymentData.amount)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Payment;
