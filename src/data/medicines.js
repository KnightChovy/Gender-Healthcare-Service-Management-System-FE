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
    },
    
    // Thuốc chuyên khoa phụ khoa
    'folic-acid': {
        id: 'folic-acid',
        name: 'Acid Folic',
        genericName: 'Folic Acid',
        strength: '5mg',
        forms: ['Viên nén'],
        indications: ['Thiếu hụt acid folic', 'Hỗ trợ thai kỳ', 'Phòng ngừa thiếu máu'],
        contraindications: ['Dị ứng acid folic'],
        sideEffects: ['Buồn nôn', 'Đầy bụng', 'Mất ngủ'],
        dosage: {
            adult: '1 viên/ngày',
            pregnant: '1 viên/ngày'
        }
    },
    'calcium-supplement': {
        id: 'calcium-supplement',
        name: 'Canxi bổ sung',
        genericName: 'Calcium Carbonate',
        strength: '600mg',
        forms: ['Viên nén', 'Viên sủi'],
        indications: ['Thiếu canxi', 'Loãng xương', 'Hỗ trợ thai kỳ'],
        contraindications: ['Sỏi thận canxi', 'Tăng canxi máu'],
        sideEffects: ['Táo bón', 'Đầy bụng', 'Buồn nôn'],
        dosage: {
            adult: '1-2 viên/ngày',
            pregnant: '1 viên x 2 lần/ngày'
        }
    },
    'progesterone': {
        id: 'progesterone',
        name: 'Progesterone',
        genericName: 'Progesterone',
        strength: '200mg',
        forms: ['Viên đặt âm đạo', 'Gel'],
        indications: ['Thiếu progesterone', 'Hỗ trợ thai kỳ', 'Rối loạn kinh nguyệt'],
        contraindications: ['Ung thư vú', 'Xuất huyết âm đạo không rõ nguyên nhân'],
        sideEffects: ['Buồn nôn', 'Đau đầu', 'Chóng mặt'],
        dosage: {
            adult: 'Theo hướng dẫn bác sĩ',
            pregnant: 'Theo hướng dẫn bác sĩ chuyên khoa'
        }
    },
    
    // Kháng sinh chuyên khoa
    'doxycycline': {
        id: 'doxycycline',
        name: 'Doxycycline',
        genericName: 'Doxycycline',
        strength: '100mg',
        forms: ['Viên nang'],
        indications: ['Nhiễm khuẩn chlamydia', 'Nhiễm khuẩn mycoplasma', 'Nhiễm khuẩn đường tiết niệu'],
        contraindications: ['Thai kỳ', 'Trẻ dưới 8 tuổi', 'Dị ứng tetracycline'],
        sideEffects: ['Buồn nôn', 'Tiêu chảy', 'Nhạy cảm ánh sáng'],
        dosage: {
            adult: '1 viên x 2 lần/ngày x 7-14 ngày',
            children: 'Không khuyến cáo dưới 8 tuổi'
        }
    },
    'metronidazole': {
        id: 'metronidazole',
        name: 'Metronidazole',
        genericName: 'Metronidazole',
        strength: '500mg',
        forms: ['Viên nén', 'Gel âm đạo'],
        indications: ['Nhiễm khuẩn yếm khí', 'Viêm âm đạo do Trichomonas', 'Nhiễm khuẩn Helicobacter pylori'],
        contraindications: ['Dị ứng metronidazole', 'Thai kỳ 3 tháng đầu'],
        sideEffects: ['Vị kim loại trong miệng', 'Buồn nôn', 'Đau đầu'],
        dosage: {
            adult: '1 viên x 2-3 lần/ngày x 7 ngày',
            pregnant: 'Chỉ dùng khi cần thiết'
        }
    },
    
    // Thuốc hỗ trợ gan
    'silymarin': {
        id: 'silymarin',
        name: 'Silymarin',
        genericName: 'Silymarin',
        strength: '70mg',
        forms: ['Viên nang'],
        indications: ['Bảo vệ gan', 'Hỗ trợ chức năng gan', 'Viêm gan mạn'],
        contraindications: ['Dị ứng cây họ cúc'],
        sideEffects: ['Đau bụng nhẹ', 'Buồn nôn', 'Tiêu chảy'],
        dosage: {
            adult: '1-2 viên x 3 lần/ngày',
            children: 'Theo hướng dẫn bác sĩ'
        }
    },
    'ursodeoxycholic-acid': {
        id: 'ursodeoxycholic-acid',
        name: 'Ursodeoxycholic Acid',
        genericName: 'Ursodeoxycholic Acid',
        strength: '250mg',
        forms: ['Viên nang'],
        indications: ['Sỏi mật cholesterol', 'Viêm gan mạn', 'Xơ gan mật nguyên phát'],
        contraindications: ['Sỏi mật có canxi', 'Viêm túi mật cấp'],
        sideEffects: ['Tiêu chảy', 'Đau bụng', 'Buồn nôn'],
        dosage: {
            adult: '2-3 viên/ngày chia làm nhiều lần',
            children: 'Theo hướng dẫn bác sĩ'
        }
    },
    
    // Thuốc hỗ trợ thận
    'furosemide': {
        id: 'furosemide',
        name: 'Furosemide',
        genericName: 'Furosemide',
        strength: '40mg',
        forms: ['Viên nén'],
        indications: ['Phù nước', 'Tăng huyết áp', 'Suy tim'],
        contraindications: ['Mất nước nặng', 'Suy thận nặng'],
        sideEffects: ['Chóng mặt', 'Đau đầu', 'Mất cân bằng điện giải'],
        dosage: {
            adult: '1-2 viên/ngày vào buổi sáng',
            elderly: 'Giảm liều, theo dõi chức năng thận'
        }
    },
    
    // Thuốc nội tiết
    'levothyroxine': {
        id: 'levothyroxine',
        name: 'Levothyroxine',
        genericName: 'Levothyroxine sodium',
        strength: '50mcg',
        forms: ['Viên nén'],
        indications: ['Suy giáp', 'Bướu giáp', 'Ung thư tuyến giáp'],
        contraindications: ['Cơn tim cấp', 'Suy thượng thận'],
        sideEffects: ['Đánh trống ngực', 'Mất ngủ', 'Rung tay'],
        dosage: {
            adult: '1 viên/ngày vào buổi sáng đói',
            elderly: 'Bắt đầu với liều thấp'
        }
    },
    'metformin': {
        id: 'metformin',
        name: 'Metformin',
        genericName: 'Metformin HCl',
        strength: '500mg',
        forms: ['Viên nén', 'Viên giải phóng chậm'],
        indications: ['Đái tháo đường type 2', 'Hội chứng buồng trứng đa nang'],
        contraindications: ['Suy thận', 'Suy gan', 'Cơn toan chuyển hóa'],
        sideEffects: ['Buồn nôn', 'Tiêu chảy', 'Đau bụng'],
        dosage: {
            adult: '1 viên x 2-3 lần/ngày sau ăn',
            children: 'Theo hướng dẫn bác sĩ'
        }
    },
    
    // Thuốc chống nấm
    'fluconazole': {
        id: 'fluconazole',
        name: 'Fluconazole',
        genericName: 'Fluconazole',
        strength: '150mg',
        forms: ['Viên nang'],
        indications: ['Nhiễm nấm Candida', 'Viêm âm đạo do nấm', 'Nhiễm nấm da'],
        contraindications: ['Dị ứng azole', 'Suy gan nặng'],
        sideEffects: ['Buồn nôn', 'Đau đầu', 'Đau bụng'],
        dosage: {
            adult: '1 viên/lần (liều đơn) hoặc theo chỉ định',
            children: 'Theo cân nặng'
        }
    },
    
    // Thuốc tim mạch
    'amlodipine': {
        id: 'amlodipine',
        name: 'Amlodipine',
        genericName: 'Amlodipine besylate',
        strength: '5mg',
        forms: ['Viên nén'],
        indications: ['Tăng huyết áp', 'Đau thắt ngực', 'Bệnh động mạch vành'],
        contraindications: ['Suy tim nặng', 'Sốc tim'],
        sideEffects: ['Phù mắt cá chân', 'Chóng mặt', 'Mệt mỏi'],
        dosage: {
            adult: '1 viên/ngày',
            elderly: 'Bắt đầu với liều thấp'
        }
    },
    
    // Thuốc điều hòa kinh nguyệt
    'clomiphene': {
        id: 'clomiphene',
        name: 'Clomiphene',
        genericName: 'Clomiphene citrate',
        strength: '50mg',
        forms: ['Viên nén'],
        indications: ['Rối loạn rụng trứng', 'Hỗ trợ sinh sản', 'PCOS'],
        contraindications: ['U buồng trứng', 'Thai kỳ', 'Xuất huyết âm đạo'],
        sideEffects: ['Bốc hỏa', 'Đau bụng', 'Buồn nôn'],
        dosage: {
            adult: 'Theo chu kỳ điều trị, hướng dẫn bác sĩ chuyên khoa',
            monitoring: 'Cần theo dõi siêu âm'
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
    },
    
    // Đơn thuốc theo kết quả xét nghiệm
    'blood-test-anemia': {
        condition: 'Thiếu máu (theo kết quả XN máu)',
        medicines: [
            {
                medicine: medicines['iron-supplement'],
                dosage: '1 viên x 2 lần/ngày sau ăn',
                duration: '3 tháng',
                notes: 'Uống cùng nước cam để tăng hấp thu'
            },
            {
                medicine: medicines['folic-acid'],
                dosage: '1 viên/ngày',
                duration: '3 tháng',
                notes: 'Hỗ trợ tạo hồng cầu'
            },
            {
                medicine: medicines['vitamin-d3'],
                dosage: '1 viên/ngày',
                duration: '3 tháng',
                notes: 'Hỗ trợ hấp thu sắt'
            }
        ],
        advice: 'Ăn nhiều thịt đỏ, rau xanh, trái cây. Tái khám sau 4-6 tuần để đánh giá hiệu quả điều trị.'
    },
    'blood-test-infection': {
        condition: 'Nhiễm khuẩn (theo kết quả XN máu)',
        medicines: [
            {
                medicine: medicines.amoxicillin,
                dosage: '1 viên x 3 lần/ngày',
                duration: '7-10 ngày',
                notes: 'Uống đều đặn, không bỏ sót liều'
            },
            {
                medicine: medicines.omeprazole,
                dosage: '1 viên/ngày trước ăn',
                duration: '10 ngày',
                notes: 'Bảo vệ dạ dày'
            }
        ],
        advice: 'Nghỉ ngơi đầy đủ, uống nhiều nước, hoàn thành liều kháng sinh.'
    },
    'urine-test-uti': {
        condition: 'Nhiễm khuẩn đường tiết niệu',
        medicines: [
            {
                medicine: medicines.azithromycin,
                dosage: '1 viên/ngày',
                duration: '3-5 ngày',
                notes: 'Uống vào cùng giờ mỗi ngày'
            }
        ],
        advice: 'Uống nhiều nước (ít nhất 2 lít/ngày), đi tiểu thường xuyên, vệ sinh vùng kín sạch sẽ.'
    },
    'hormone-test-thyroid': {
        condition: 'Rối loạn tuyến giáp',
        medicines: [
            {
                medicine: medicines['vitamin-d3'],
                dosage: '1 viên/ngày',
                duration: '3 tháng',
                notes: 'Hỗ trợ chức năng tuyến giáp'
            },
            {
                medicine: medicines['iron-supplement'],
                dosage: '1 viên/ngày',
                duration: '2 tháng',
                notes: 'Bổ sung sắt nếu thiếu'
            }
        ],
        advice: 'Tái khám sau 6 tuần, theo dõi triệu chứng, ăn đủ iod.'
    },
    'pregnancy-test-prenatal': {
        condition: 'Hỗ trợ thai kỳ',
        medicines: [
            {
                medicine: medicines['folic-acid'],
                dosage: '1 viên/ngày',
                duration: 'Suốt thai kỳ',
                notes: 'Quan trọng 3 tháng đầu'
            },
            {
                medicine: medicines['iron-supplement'],
                dosage: '1 viên/ngày',
                duration: 'Từ tháng thứ 4',
                notes: 'Phòng thiếu máu thai kỳ'
            },
            {
                medicine: medicines['calcium-supplement'],
                dosage: '1 viên x 2 lần/ngày',
                duration: 'Suốt thai kỳ',
                notes: 'Hỗ trợ phát triển xương thai nhi'
            }
        ],
        advice: 'Khám thai định kỳ, ăn đầy đủ dinh dưỡng, tránh stress.'
    },
    'std-test-chlamydia': {
        condition: 'Nhiễm Chlamydia',
        medicines: [
            {
                medicine: medicines.doxycycline,
                dosage: '1 viên x 2 lần/ngày',
                duration: '7 ngày',
                notes: 'Uống sau ăn, tránh ánh sáng mặt trời'
            },
            {
                medicine: medicines.omeprazole,
                dosage: '1 viên/ngày',
                duration: '7 ngày',
                notes: 'Bảo vệ dạ dày'
            }
        ],
        advice: 'Kiêng quan hệ tình dục trong thời gian điều trị. Partner cũng cần điều trị.'
    },
    'std-test-trichomoniasis': {
        condition: 'Nhiễm Trichomonas',
        medicines: [
            {
                medicine: medicines.metronidazole,
                dosage: '1 viên x 2 lần/ngày',
                duration: '7 ngày',
                notes: 'Không uống rượu bia trong thời gian điều trị'
            }
        ],
        advice: 'Kiêng rượu bia hoàn toàn, partner cần điều trị cùng lúc.'
    },
    'fertility-test-low-hormone': {
        condition: 'Rối loạn hormone sinh sản',
        medicines: [
            {
                medicine: medicines.progesterone,
                dosage: 'Theo hướng dẫn bác sĩ',
                duration: '3-6 tháng',
                notes: 'Sử dụng đúng thời điểm trong chu kỳ'
            },
            {
                medicine: medicines['folic-acid'],
                dosage: '1 viên/ngày',
                duration: '3 tháng',
                notes: 'Chuẩn bị cho thai kỳ'
            }
        ],
        advice: 'Theo dõi chu kỳ kinh nguyệt, giảm stress, tập thể dục đều đặn.'
    },
    'cancer-screening-support': {
        condition: 'Hỗ trợ sau tầm soát ung thư',
        medicines: [
            {
                medicine: medicines['vitamin-d3'],
                dosage: '1 viên/ngày',
                duration: '6 tháng',
                notes: 'Tăng cường miễn dịch'
            },
            {
                medicine: medicines.silymarin,
                dosage: '1 viên x 2 lần/ngày',
                duration: '3 tháng',
                notes: 'Bảo vệ gan'
            }
        ],
        advice: 'Duy trì lối sống lành mạnh, tái khám định kỳ, tránh stress.'
    },
    'genetic-test-counseling': {
        condition: 'Tư vấn sau xét nghiệm di truyền',
        medicines: [
            {
                medicine: medicines['folic-acid'],
                dosage: '1 viên/ngày',
                duration: '6 tháng',
                notes: 'Phòng ngừa thiếu hụt'
            },
            {
                medicine: medicines['vitamin-d3'],
                dosage: '1 viên/ngày',
                duration: '6 tháng',
                notes: 'Hỗ trợ tổng thể'
            }
        ],
        advice: 'Tư vấn di truyền định kỳ, theo dõi sức khỏe, lập kế hoạch sinh sản hợp lý.'
    },
    
    // Template bổ sung theo loại xét nghiệm
    'blood-test-diabetes': {
        condition: 'Đái tháo đường (theo XN máu)',
        medicines: [
            {
                medicine: medicines.metformin,
                dosage: '1 viên x 2 lần/ngày sau ăn',
                duration: 'Dài hạn',
                notes: 'Bắt đầu với liều thấp, tăng dần'
            },
            {
                medicine: medicines['vitamin-d3'],
                dosage: '1 viên/ngày',
                duration: '6 tháng',
                notes: 'Hỗ trợ chuyển hóa glucose'
            }
        ],
        advice: 'Chế độ ăn ít đường, tập thể dục đều đặn, theo dõi đường huyết hàng ngày.'
    },
    'blood-test-thyroid': {
        condition: 'Rối loạn tuyến giáp (theo XN máu)',
        medicines: [
            {
                medicine: medicines.levothyroxine,
                dosage: '1 viên/ngày vào buổi sáng đói',
                duration: 'Dài hạn',
                notes: 'Uống cách xa thức ăn và thuốc khác 1 giờ'
            },
            {
                medicine: medicines['vitamin-d3'],
                dosage: '1 viên/ngày',
                duration: '3 tháng',
                notes: 'Hỗ trợ chức năng tuyến giáp'
            }
        ],
        advice: 'Tái khám sau 6-8 tuần, theo dõi triệu chứng, ăn đủ iod.'
    },
    'urine-test-kidney': {
        condition: 'Rối loạn chức năng thận',
        medicines: [
            {
                medicine: medicines.furosemide,
                dosage: '1 viên/ngày vào buổi sáng',
                duration: 'Theo chỉ định',
                notes: 'Theo dõi điện giải và chức năng thận'
            },
            {
                medicine: medicines.amlodipine,
                dosage: '1 viên/ngày',
                duration: 'Dài hạn',
                notes: 'Kiểm soát huyết áp bảo vệ thận'
            }
        ],
        advice: 'Hạn chế muối, uống đủ nước, theo dõi huyết áp, tái khám định kỳ.'
    },
    'std-test-candida': {
        condition: 'Nhiễm nấm Candida',
        medicines: [
            {
                medicine: medicines.fluconazole,
                dosage: '1 viên (liều đơn)',
                duration: '1 lần',
                notes: 'Có thể lặp lại sau 3 ngày nếu cần'
            }
        ],
        advice: 'Giữ vùng kín khô ráo, mặc đồ lót cotton, tránh douche âm đạo.'
    },
    'fertility-test-pcos': {
        condition: 'Hội chứng buồng trứng đa nang (PCOS)',
        medicines: [
            {
                medicine: medicines.metformin,
                dosage: '1 viên x 2 lần/ngày',
                duration: '6 tháng',
                notes: 'Cải thiện kháng insulin'
            },
            {
                medicine: medicines.clomiphene,
                dosage: 'Theo chu kỳ điều trị',
                duration: '3-6 chu kỳ',
                notes: 'Chỉ dùng khi muốn có thai, cần theo dõi siêu âm'
            },
            {
                medicine: medicines['folic-acid'],
                dosage: '1 viên/ngày',
                duration: '3 tháng',
                notes: 'Chuẩn bị cho thai kỳ'
            }
        ],
        advice: 'Giảm cân nếu thừa cân, tập thể dục đều đặn, chế độ ăn ít đường tinh chế.'
    },
    'hormone-test-menopause': {
        condition: 'Tiền mãn kinh/Mãn kinh',
        medicines: [
            {
                medicine: medicines['calcium-supplement'],
                dosage: '1 viên x 2 lần/ngày',
                duration: 'Dài hạn',
                notes: 'Phòng ngừa loãng xương'
            },
            {
                medicine: medicines['vitamin-d3'],
                dosage: '1 viên/ngày',
                duration: 'Dài hạn',
                notes: 'Hỗ trợ hấp thu canxi'
            }
        ],
        advice: 'Tập thể dục chịu lực, ăn đủ canxi, tránh thuốc lá và rượu.'
    }
};

export default { medicines, prescriptionTemplates };
