// Danh sách các loại tư vấn
export const consultationTypes = {
    'general': {
        id: 'general',
        name: 'Tư vấn sức khỏe tổng quát',
        description: 'Tư vấn về sức khỏe chung, phòng bệnh và chăm sóc sức khỏe',
        price: 500000,
        duration: '30-45 phút',
        specialties: ['Bác sĩ đa khoa']
    },
    'gynecology': {
        id: 'gynecology',
        name: 'Tư vấn phụ khoa',
        description: 'Tư vấn về sức khỏe phụ nữ, chu kỳ kinh nguyệt, thai kỳ',
        price: 600000,
        duration: '30-60 phút',
        specialties: ['Bác sĩ sản phụ khoa']
    },
    'reproductive': {
        id: 'reproductive',
        name: 'Tư vấn sức khỏe sinh sản',
        description: 'Tư vấn về khả năng sinh sản, kế hoạch hóa gia đình',
        price: 700000,
        duration: '45-60 phút',
        specialties: ['Bác sĩ sản phụ khoa', 'Bác sĩ nam khoa']
    },
    'pregnancy': {
        id: 'pregnancy',
        name: 'Tư vấn thai kỳ',
        description: 'Tư vấn chăm sóc thai kỳ, dinh dưỡng bà bầu',
        price: 650000,
        duration: '30-45 phút',
        specialties: ['Bác sĩ sản phụ khoa', 'Điều dưỡng hộ sinh']
    },
    'mental-health': {
        id: 'mental-health',
        name: 'Tư vấn sức khỏe tâm thần',
        description: 'Tư vấn về stress, lo âu, trầm cảm',
        price: 800000,
        duration: '60-90 phút',
        specialties: ['Bác sĩ tâm thần', 'Nhà tâm lý học']
    },
    'sexual-health': {
        id: 'sexual-health',
        name: 'Tư vấn sức khỏe tình dục',
        description: 'Tư vấn về an toàn tình dục, bệnh lây truyền',
        price: 600000,
        duration: '30-45 phút',
        specialties: ['Bác sĩ da liễu', 'Bác sĩ sản phụ khoa']
    },
    'nutrition': {
        id: 'nutrition',
        name: 'Tư vấn dinh dưỡng',
        description: 'Tư vấn chế độ ăn uống, kiểm soát cân nặng',
        price: 450000,
        duration: '30-45 phút',
        specialties: ['Chuyên gia dinh dưỡng', 'Bác sĩ nội khoa']
    },
    'preventive': {
        id: 'preventive',
        name: 'Tư vấn y học dự phòng',
        description: 'Tư vấn phòng ngừa bệnh tật, tiêm chủng',
        price: 400000,
        duration: '30-45 phút',
        specialties: ['Bác sĩ y học dự phòng', 'Bác sĩ đa khoa']
    }
};
