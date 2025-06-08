export const doctorsData = [
  {
    id: 'dr001',
    name: 'BS. Nguyễn Thị Lan Anh',
    specialty: 'Sức khỏe sinh sản nữ',
    experience: '8 năm kinh nghiệm',
    rating: 4.9,
    reviews: 156,
    education: 'Đại học Y Hà Nội',
    avatar: '/api/placeholder/80/80',
    consultationTypes: ['reproductive', 'gynecology', 'pregnancy'],
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    timeSlots: {
      morning: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
      afternoon: ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
    }
  },
  {
    id: 'dr002',
    name: 'BS. Trần Minh Hoàng',
    specialty: 'Sức khỏe nam giới',
    experience: '12 năm kinh nghiệm',
    rating: 4.8,
    reviews: 203,
    education: 'Đại học Y Dược TP.HCM',
    avatar: '/api/placeholder/80/80',
    consultationTypes: ['male_health', 'urology', 'fertility'],
    workingDays: ['monday', 'wednesday', 'friday', 'saturday'],
    timeSlots: {
      morning: ['08:00', '08:30', '09:00', '09:30', '10:00'],
      afternoon: ['13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
    }
  },
  {
    id: 'dr003',
    name: 'BS. Lê Thị Minh Châu',
    specialty: 'Tâm lý giới tính',
    experience: '6 năm kinh nghiệm',
    rating: 4.7,
    reviews: 89,
    education: 'Đại học Y khoa Phạm Ngọc Thạch',
    avatar: '/api/placeholder/80/80',
    consultationTypes: ['psychology', 'counseling', 'relationship'],
    workingDays: ['tuesday', 'thursday', 'saturday', 'sunday'],
    timeSlots: {
      morning: ['09:00', '09:30', '10:00', '10:30', '11:00'],
      afternoon: ['15:00', '15:30', '16:00', '16:30'],
    }
  },
  {
    id: 'dr004',
    name: 'BS. Phạm Văn Đức',
    specialty: 'Bệnh lây truyền qua đường tình dục',
    experience: '10 năm kinh nghiệm',
    rating: 4.9,
    reviews: 178,
    education: 'Đại học Y Hà Nội',
    avatar: '/api/placeholder/80/80',
    consultationTypes: ['sti', 'infectious_diseases', 'prevention'],
    workingDays: ['monday', 'tuesday', 'wednesday', 'friday'],
    timeSlots: {
      morning: ['08:30', '09:00', '09:30', '10:00', '10:30', '11:00'],
      afternoon: ['14:00', '14:30', '15:00', '15:30', '16:00'],
    }
  },
  // Thêm 2 bác sĩ mới
  {
    id: 'dr005',
    name: 'BS. Võ Thị Kim Ngân',
    specialty: 'Nội tiết - Chuyển hóa',
    experience: '15 năm kinh nghiệm',
    rating: 4.9,
    reviews: 267,
    education: 'Đại học Y Dược TP.HCM',
    avatar: '/api/placeholder/80/80',
    consultationTypes: ['hormone', 'metabolic', 'diabetes', 'reproductive'],
    workingDays: ['monday', 'tuesday', 'thursday', 'friday', 'saturday'],
    timeSlots: {
      morning: ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30'],
      afternoon: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
    }
  },
  {
    id: 'dr006',
    name: 'BS. Đặng Minh Tuấn',
    specialty: 'Da liễu & Thẩm mỹ',
    experience: '9 năm kinh nghiệm',
    rating: 4.6,
    reviews: 134,
    education: 'Đại học Y Hà Nội',
    avatar: '/api/placeholder/80/80',
    consultationTypes: ['dermatology', 'cosmetic', 'sti', 'skin_health'],
    workingDays: ['wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    timeSlots: {
      morning: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30'],
      afternoon: ['14:30', '15:00', '15:30', '16:00', '16:30'],
    }
  }
];