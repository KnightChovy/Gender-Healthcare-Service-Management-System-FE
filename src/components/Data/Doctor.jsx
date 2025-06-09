export const doctorsData = [
  {
    id: 'dr001',
    name: 'BS. Nguyễn Thị Lan Anh',
    specialty: ['gynecology', 'menstrual_cycle'],
    experience: '8 năm kinh nghiệm',
    rating: 4.9,
    reviews: 156,
    education: 'Đại học Y Hà Nội',
    avatar: '/api/placeholder/80/80',
    consultationTypes: ['gynecology', 'reproductive_health', 'women_health'],
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    description: 'Chuyên khoa phụ khoa với nhiều năm kinh nghiệm trong điều trị các bệnh lý phụ khoa, khám sức khỏe sinh sản nữ.'
  },
  {
    id: 'dr002',
    name: 'BS. Trần Thị Minh Châu',
    specialty: ['menstrual_cycle', 'contraception'],
    experience: '6 năm kinh nghiệm',
    rating: 4.8,
    reviews: 203,
    education: 'Đại học Y Dược TP.HCM',
    avatar: '/api/placeholder/80/80',
    consultationTypes: ['menstrual_cycle', 'hormone_consultation', 'period_issues'],
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    description: 'Chuyên tư vấn về chu kì kinh nguyệt, rối loạn nội tiết tố, điều trị các vấn đề liên quan đến kinh nguyệt.'
  },
  {
    id: 'dr003',
    name: 'BS. Lê Văn Minh',
    specialty: ['contraception', 'fertility'],
    experience: '10 năm kinh nghiệm',
    rating: 4.7,
    reviews: 189,
    education: 'Đại học Y khoa Phạm Ngọc Thạch',
    avatar: '/api/placeholder/80/80',
    consultationTypes: ['contraception', 'family_planning', 'birth_control'],
    workingDays: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    description: 'Chuyên tư vấn các phương pháp tránh thai, kế hoạch hóa gia đình, tư vấn sức khỏe sinh sản.'
  },
  {
    id: 'dr004',
    name: 'BS. Phạm Thị Hương',
    specialty: ['pregnancy', 'general_consultation'],
    experience: '12 năm kinh nghiệm',
    rating: 4.9,
    reviews: 178,
    education: 'Đại học Y Hà Nội',
    avatar: '/api/placeholder/80/80',
    consultationTypes: ['pregnancy', 'prenatal_care', 'maternal_health'],
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    description: 'Chuyên tư vấn thai kì, chăm sóc sức khỏe bà mẹ và thai nhi, theo dõi thai kì an toàn.'
  },
  {
    id: 'dr005',
    name: 'BS. Võ Thị Kim Ngân',
    specialty: ['fertility'],
    experience: '15 năm kinh nghiệm',
    rating: 4.9,
    reviews: 267,
    education: 'Đại học Y Dược TP.HCM',
    avatar: '/api/placeholder/80/80',
    consultationTypes: ['fertility', 'reproductive_health', 'infertility_treatment'],
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    description: 'Chuyên tư vấn sức khỏe sinh sản, điều trị vô sinh hiếm muộn, hỗ trợ sinh sản.'
  },
  {
    id: 'dr006',
    name: 'BS. Đặng Minh Tuấn',
    specialty: ['general_consultation', 'gynecology', 'fertility'],
    experience: '9 năm kinh nghiệm',
    rating: 4.6,
    reviews: 134,
    education: 'Đại học Y Hà Nội',
    avatar: '/api/placeholder/80/80',
    consultationTypes: ['general_consultation', 'health_checkup', 'preventive_care'],
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    description: 'Tư vấn sức khỏe tổng quát, khám sức khỏe định kỳ, tư vấn phòng ngừa bệnh tật.'
  }
];

// Mapping specialty cho dropdown selection
export const specialtyMapping = {
  'gynecology': 'Khám phụ khoa',
  'menstrual_cycle': 'Tư vấn chu kì kinh nguyệt', 
  'contraception': 'Tư vấn tránh thai',
  'pregnancy': 'Tư vấn thai kì',
  'fertility': 'Tư vấn sinh sản',
  'general_consultation': 'Tư vấn chung'
};