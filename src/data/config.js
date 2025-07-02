// Giá dịch vụ
export const pricing = {
    appointments: {
        'general': 500000,
        'gynecology': 600000,
        'reproductive': 700000,
        'pregnancy': 650000,
        'mental-health': 800000,
        'sexual-health': 600000,
        'nutrition': 450000,
        'preventive': 400000
    },
    tests: {
        'blood-test': 300000,
        'urine-test': 200000,
        'hormone-test': 800000,
        'pregnancy-test': 150000,
        'std-test': 600000,
        'fertility-test': 1000000,
        'genetic-test': 2000000,
        'cancer-screening': 1500000,
        'other': 400000
    }
};

// Các trạng thái và mô tả
export const statusConfig = {
    appointment: {
        0: { text: 'Đã từ chối', color: 'text-red-600 bg-red-100' },
        1: { text: 'Chờ duyệt', color: 'text-yellow-600 bg-yellow-100' },
        2: { text: 'Đã duyệt', color: 'text-blue-600 bg-blue-100' },
        3: { text: 'Đã thanh toán', color: 'text-green-600 bg-green-100' },
        4: { text: 'Hoàn thành', color: 'text-purple-600 bg-purple-100' }
    },
    test: {
        0: { text: 'Đã từ chối', color: 'text-red-600 bg-red-100' },
        1: { text: 'Chờ duyệt', color: 'text-yellow-600 bg-yellow-100' },
        2: { text: 'Đã duyệt', color: 'text-blue-600 bg-blue-100' },
        3: { text: 'Chờ xét nghiệm', color: 'text-green-600 bg-green-100' },
        4: { text: 'Chờ bác sĩ xem xét', color: 'text-purple-600 bg-purple-100' },
        5: { text: 'Hoàn thành', color: 'text-indigo-600 bg-indigo-100' }
    }
};
