export const testTypes = {
    'blood-test': {
        id: 'blood-test',
        name: 'Xét nghiệm máu tổng quát',
        description: 'Kiểm tra các thành phần trong máu như hồng cầu, bạch cầu, tiểu cầu',
        price: 300000,
        duration: '2-4 giờ',
        preparation: [
            'Nhịn ăn 8-12 giờ trước khi xét nghiệm',
            'Uống nước lọc bình thường',
            'Tránh uống rượu bia 24h trước xét nghiệm'
        ]
    },
    'urine-test': {
        id: 'urine-test',
        name: 'Xét nghiệm nước tiểu',
        description: 'Kiểm tra chức năng thận và đường tiết niệu',
        price: 200000,
        duration: '1-2 giờ',
        preparation: [
            'Lấy nước tiểu đầu tiên vào buổi sáng',
            'Vệ sinh sạch sẽ vùng kín trước khi lấy mẫu',
            'Lấy phần giữa của dòng tiểu'
        ]
    },
    'hormone-test': {
        id: 'hormone-test',
        name: 'Xét nghiệm hormone',
        description: 'Kiểm tra các hormone trong cơ thể',
        price: 800000,
        duration: '4-6 giờ',
        preparation: [
            'Thông báo cho bác sĩ về các thuốc đang sử dụng',
            'Lấy mẫu vào thời điểm cụ thể (tùy loại hormone)',
            'Tránh stress trước khi xét nghiệm'
        ]
    },
    'pregnancy-test': {
        id: 'pregnancy-test',
        name: 'Xét nghiệm thai',
        description: 'Kiểm tra tình trạng mang thai và phát triển thai nhi',
        price: 150000,
        duration: '1-2 giờ',
        preparation: [
            'Lấy mẫu nước tiểu buổi sáng',
            'Không cần nhịn ăn',
            'Uống đủ nước'
        ]
    },
    'std-test': {
        id: 'std-test',
        name: 'Xét nghiệm bệnh lây truyền qua đường tình dục',
        description: 'Kiểm tra các bệnh lây truyền qua đường tình dục',
        price: 600000,
        duration: '2-3 ngày',
        preparation: [
            'Không quan hệ tình dục 24h trước xét nghiệm',
            'Không sử dụng thuốc kháng sinh',
            'Vệ sinh sạch sẽ vùng kín'
        ]
    },
    'fertility-test': {
        id: 'fertility-test',
        name: 'Xét nghiệm khả năng sinh sản',
        description: 'Đánh giá khả năng sinh sản ở nam và nữ',
        price: 1000000,
        duration: '1-2 ngày',
        preparation: [
            'Kiêng quan hệ tình dục 2-7 ngày trước xét nghiệm',
            'Tránh stress và mệt mỏi',
            'Không uống rượu bia'
        ]
    },
    'genetic-test': {
        id: 'genetic-test',
        name: 'Xét nghiệm di truyền',
        description: 'Phát hiện các rối loạn di truyền và nguy cơ bệnh tật',
        price: 2000000,
        duration: '7-14 ngày',
        preparation: [
            'Cung cấp thông tin gia đình chi tiết',
            'Không cần nhịn ăn',
            'Tư vấn di truyền trước xét nghiệm'
        ]
    },
    'cancer-screening': {
        id: 'cancer-screening',
        name: 'Tầm soát ung thư',
        description: 'Phát hiện sớm các dấu hiệu ung thư',
        price: 1500000,
        duration: '1-2 ngày',
        preparation: [
            'Nhịn ăn 8-12 giờ trước xét nghiệm',
            'Thông báo tiền sử bệnh gia đình',
            'Tránh sử dụng thuốc không cần thiết'
        ]
    },
    'other': {
        id: 'other',
        name: 'Khác',
        description: 'Các xét nghiệm chuyên khoa khác',
        price: 400000,
        duration: 'Tùy loại',
        preparation: [
            'Tham khảo ý kiến bác sĩ',
            'Chuẩn bị theo hướng dẫn cụ thể'
        ]
    }
};
