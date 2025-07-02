// Danh sách thuốc và đơn thuốc mẫu
export const medicines = {
    // Thuốc giảm đau, hạ sốt
    'paracetamol': {
        id: 'paracetamol',
        name: 'Paracetamol',
        genericName: 'Acetaminophen',
        strength: '500mg',
        forms: ['Viên nén', 'Viên sủi', 'Siro'],
        indications: ['Giảm đau', 'Hạ sốt'],
        contraindications: ['Suy gan nặng', 'Dị ứng paracetamol'],
        sideEffects: ['Buồn nôn', 'Nôn', 'Phát ban da'],
        dosage: {
            adult: '1-2 viên x 3-4 lần/ngày',
            children: 'Theo cân nặng: 10-15mg/kg/lần'
        }
    },
    'ibuprofen': {
        id: 'ibuprofen',
        name: 'Ibuprofen',
        genericName: 'Ibuprofen',
        strength: '400mg',
        forms: ['Viên nén', 'Gel bôi'],
        indications: ['Giảm đau', 'Chống viêm', 'Hạ sốt'],
        contraindications: ['Loét dạ dày', 'Suy thận', 'Thai kỳ cuối'],
        sideEffects: ['Đau bụng', 'Buồn nôn', 'Chóng mặt'],
        dosage: {
            adult: '1 viên x 3 lần/ngày sau ăn',
            children: 'Không dùng cho trẻ dưới 6 tháng'
        }
    },
    
    // Kháng sinh
    'amoxicillin': {
        id: 'amoxicillin',
        name: 'Amoxicillin',
        genericName: 'Amoxicillin',
        strength: '500mg',
        forms: ['Viên nang', 'Bột pha hỗn dịch'],
        indications: ['Nhiễm khuẩn đường hô hấp', 'Nhiễm khuẩn da', 'Nhiễm khuẩn tiết niệu'],
        contraindications: ['Dị ứng penicillin', 'Dị ứng beta-lactam'],
        sideEffects: ['Tiêu chảy', 'Buồn nôn', 'Phát ban'],
        dosage: {
            adult: '1 viên x 3 lần/ngày',
            children: '20-40mg/kg/ngày chia 3 lần'
        }
    },
    'azithromycin': {
        id: 'azithromycin',
        name: 'Azithromycin',
        genericName: 'Azithromycin',
        strength: '250mg',
        forms: ['Viên nén', 'Bột pha hỗn dịch'],
        indications: ['Nhiễm khuẩn đường hô hấp', 'Nhiễm khuẩn da', 'Chlamydia'],
        contraindications: ['Dị ứng macrolide', 'Rối loạn nhịp tim'],
        sideEffects: ['Buồn nôn', 'Tiêu chảy', 'Đau bụng'],
        dosage: {
            adult: '1 viên x 1 lần/ngày x 3-5 ngày',
            children: '10mg/kg/ngày x 3 ngày'
        }
    },
    
    // Thuốc dạ dày
    'omeprazole': {
        id: 'omeprazole',
        name: 'Omeprazole',
        genericName: 'Omeprazole',
        strength: '20mg',
        forms: ['Viên nang'],
        indications: ['Loét dạ dày', 'Trào ngược dạ dày', 'Hội chứng Zollinger-Ellison'],
        contraindications: ['Dị ứng omeprazole'],
        sideEffects: ['Đau đầu', 'Buồn nôn', 'Tiêu chảy'],
        dosage: {
            adult: '1 viên x 1-2 lần/ngày trước ăn',
            children: 'Theo hướng dẫn bác sĩ'
        }
    },
    
    // Vitamin và bổ sung
    'vitamin-d3': {
        id: 'vitamin-d3',
        name: 'Vitamin D3',
        genericName: 'Cholecalciferol',
        strength: '1000 IU',
        forms: ['Viên nang mềm', 'Dung dịch uống'],
        indications: ['Thiếu vitamin D', 'Loãng xương', 'Hỗ trợ hấp thu canxi'],
        contraindications: ['Thừa canxi máu', 'Sỏi thận'],
        sideEffects: ['Buồn nôn', 'Đau đầu', 'Yếu cơ'],
        dosage: {
            adult: '1 viên/ngày',
            children: 'Theo hướng dẫn bác sĩ'
        }
    },
    'iron-supplement': {
        id: 'iron-supplement',
        name: 'Sắt bổ sung',
        genericName: 'Ferrous sulfate',
        strength: '65mg',
        forms: ['Viên nén', 'Dung dịch'],
        indications: ['Thiếu máu do thiếu sắt', 'Bổ sung sắt'],
        contraindications: ['Thừa sắt', 'Viêm ruột'],
        sideEffects: ['Táo bón', 'Buồn nôn', 'Đau bụng'],
        dosage: {
            adult: '1 viên x 2-3 lần/ngày',
            pregnant: '1 viên x 2 lần/ngày'
        }
    }
};

// Đơn thuốc mẫu theo bệnh/triệu chứng
export const prescriptionTemplates = {
    'common-cold': {
        condition: 'Cảm lạnh thông thường',
        medicines: [
            {
                medicine: medicines.paracetamol,
                dosage: '1 viên x 3 lần/ngày sau ăn',
                duration: '3-5 ngày',
                notes: 'Uống khi sốt hoặc đau đầu'
            }
        ],
        advice: 'Nghỉ ngơi, uống nhiều nước, giữ ấm cơ thể'
    },
    'bacterial-infection': {
        condition: 'Nhiễm khuẩn',
        medicines: [
            {
                medicine: medicines.amoxicillin,
                dosage: '1 viên x 3 lần/ngày',
                duration: '7-10 ngày',
                notes: 'Uống đủ liều theo đơn, không bỏ sót'
            },
            {
                medicine: medicines.omeprazole,
                dosage: '1 viên x 1 lần/ngày trước ăn',
                duration: '7 ngày',
                notes: 'Bảo vệ dạ dày khi dùng kháng sinh'
            }
        ],
        advice: 'Uống đủ liều kháng sinh, không tự ý ngừng thuốc'
    },
    'anemia': {
        condition: 'Thiếu máu',
        medicines: [
            {
                medicine: medicines['iron-supplement'],
                dosage: '1 viên x 2 lần/ngày',
                duration: '3 tháng',
                notes: 'Uống cùng vitamin C để tăng hấp thu'
            },
            {
                medicine: medicines['vitamin-d3'],
                dosage: '1 viên/ngày',
                duration: '3 tháng',
                notes: 'Hỗ trợ hấp thu canxi và sắt'
            }
        ],
        advice: 'Ăn nhiều thực phẩm giàu sắt, tái khám sau 1 tháng'
    },
    'gastritis': {
        condition: 'Viêm dạ dày',
        medicines: [
            {
                medicine: medicines.omeprazole,
                dosage: '1 viên x 2 lần/ngày trước ăn',
                duration: '4-6 tuần',
                notes: 'Uống 30 phút trước bữa ăn'
            }
        ],
        advice: 'Ăn nhẹ, tránh cay nóng, cà phê, rượu bia'
    }
};

export default { medicines, prescriptionTemplates };
