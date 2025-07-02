// Kết quả xét nghiệm mẫu cho từng loại
export const testResults = {
    'blood-test': {
        good: {
            summary: "Kết quả xét nghiệm máu bình thường",
            details: `
Hồng cầu (RBC): 4.5 triệu/μL (Bình thường: 4.0-5.5)
Bạch cầu (WBC): 7,000/μL (Bình thường: 4,000-11,000)
Tiểu cầu: 250,000/μL (Bình thường: 150,000-450,000)
Hemoglobin: 14.5 g/dL (Bình thường: 12-16)
Glucose: 95 mg/dL (Bình thường: 70-110)
Cholesterol: 180 mg/dL (Bình thường: <200)

Kết luận: Các chỉ số trong giới hạn bình thường.`
        },
        bad: {
            summary: "Phát hiện bất thường trong xét nghiệm máu",
            details: `
Hồng cầu (RBC): 3.2 triệu/μL (THẤP - Bình thường: 4.0-5.5)
Bạch cầu (WBC): 12,500/μL (CAO - Bình thường: 4,000-11,000)
Tiểu cầu: 120,000/μL (THẤP - Bình thường: 150,000-450,000)
Hemoglobin: 9.8 g/dL (THẤP - Bình thường: 12-16)
Glucose: 145 mg/dL (CAO - Bình thường: 70-110)
Cholesterol: 240 mg/dL (CAO - Bình thường: <200)

Kết luận: Có dấu hiệu thiếu máu, đường huyết cao, cholesterol cao.`
        }
    },
    'urine-test': {
        good: {
            summary: "Kết quả xét nghiệm nước tiểu bình thường",
            details: `
Màu sắc: Vàng nhạt (Bình thường)
Protein: Âm tính (Bình thường)
Glucose: Âm tính (Bình thường)
Hồng cầu: 0-2/HPF (Bình thường)
Bạch cầu: 0-5/HPF (Bình thường)
Vi khuẩn: Không phát hiện

Kết luận: Chức năng thận và đường tiết niệu bình thường.`
        },
        bad: {
            summary: "Phát hiện bất thường trong nước tiểu",
            details: `
Màu sắc: Vàng đậm (Bất thường)
Protein: Dương tính (+++) (BẤT THƯỜNG)
Glucose: Dương tính (++) (BẤT THƯỜNG)
Hồng cầu: 8-12/HPF (CAO)
Bạch cầu: 15-20/HPF (CAO)
Vi khuẩn: Có phát hiện E.coli

Kết luận: Nghi ngờ nhiễm trùng đường tiết niệu, proteinuria.`
        }
    },
    'hormone-test': {
        good: {
            summary: "Hormone trong giới hạn bình thường",
            details: `
TSH: 2.5 mIU/L (Bình thường: 0.4-4.0)
T4: 8.5 μg/dL (Bình thường: 4.5-12.0)
T3: 150 ng/dL (Bình thường: 80-200)
Cortisol: 12 μg/dL (Bình thường: 6-23)
Testosterone: 450 ng/dL (Bình thường: 300-1000)
Estradiol: 50 pg/mL (Bình thường: 30-400)

Kết luận: Hệ thống nội tiết hoạt động bình thường.`
        },
        bad: {
            summary: "Rối loạn hormone",
            details: `
TSH: 8.2 mIU/L (CAO - Bình thường: 0.4-4.0)
T4: 3.2 μg/dL (THẤP - Bình thường: 4.5-12.0)
T3: 65 ng/dL (THẤP - Bình thường: 80-200)
Cortisol: 28 μg/dL (CAO - Bình thường: 6-23)
Testosterone: 180 ng/dL (THẤP - Bình thường: 300-1000)
Estradiol: 15 pg/mL (THẤP - Bình thường: 30-400)

Kết luận: Suy giáp trạng, rối loạn hormone sinh dục.`
        }
    },
    'pregnancy-test': {
        good: {
            summary: "Mang thai bình thường",
            details: `
hCG: 1,200 mIU/mL (Dương tính - Tuần thai 4-5)
AFP: 25 IU/mL (Bình thường)
Estriol: 2.5 ng/mL (Bình thường)
PAPP-A: 1.2 MoM (Bình thường)
Free β-hCG: 1.8 MoM (Bình thường)

Kết luận: Thai kỳ phát triển bình thường, không có dấu hiệu bất thường.`
        },
        bad: {
            summary: "Không mang thai",
            details: `
hCG: <5 mIU/mL (Âm tính)
AFP: 3.2 IU/mL (Bình thường)
Estriol: 0.8 ng/mL (Thấp)
PAPP-A: N/A
Free β-hCG: N/A

Kết luận: Không có thai, hormone sinh sản thấp.`
        }
    },
    'std-test': {
        good: {
            summary: "Không phát hiện bệnh lây truyền qua đường tình dục",
            details: `
HIV (HIV-1/2): Âm tính
Giang mai (VDRL/RPR): Âm tính
Lậu cầu (Gonorrhea): Âm tính
Chlamydia: Âm tính
Herpes (HSV-1/2): Âm tính
Viêm gan B (HBsAg): Âm tính
Viêm gan C (HCV): Âm tính

Kết luận: Không phát hiện các bệnh lây truyền qua đường tình dục.`
        },
        bad: {
            summary: "Phát hiện dương tính với một số bệnh",
            details: `
HIV (HIV-1/2): Âm tính
Giang mai (VDRL/RPR): DƯƠNG TÍNH (Titer 1:8)
Lậu cầu (Gonorrhea): DƯƠNG TÍNH
Chlamydia: DƯƠNG TÍNH
Herpes (HSV-1/2): Âm tính
Viêm gan B (HBsAg): Âm tính
Viêm gan C (HCV): Âm tính

Kết luận: Nhiễm giang mai, lậu và chlamydia. Cần điều trị ngay.`
        }
    },
    'fertility-test': {
        good: {
            summary: "Khả năng sinh sản bình thường",
            details: `
Số lượng tinh trùng: 45 triệu/mL (Bình thường: >15 triệu/mL)
Độ vận động: 65% (Bình thường: >40%)
Hình thái bình thường: 8% (Bình thường: >4%)
Thể tích: 3.5 mL (Bình thường: >1.5 mL)
FSH: 4.2 IU/L (Bình thường: 1.5-12.4)
LH: 3.8 IU/L (Bình thường: 1.7-8.6)

Kết luận: Các thông số sinh sản trong giới hạn bình thường.`
        },
        bad: {
            summary: "Giảm khả năng sinh sản",
            details: `
Số lượng tinh trùng: 8 triệu/mL (THẤP - Bình thường: >15 triệu/mL)
Độ vận động: 25% (THẤP - Bình thường: >40%)
Hình thái bình thường: 2% (THẤP - Bình thường: >4%)
Thể tích: 1.2 mL (THẤP - Bình thường: >1.5 mL)
FSH: 18.5 IU/L (CAO - Bình thường: 1.5-12.4)
LH: 15.2 IU/L (CAO - Bình thường: 1.7-8.6)

Kết luận: Oligozoospermia, asthenozoospermia. Khả năng sinh sản giảm.`
        }
    },
    'genetic-test': {
        good: {
            summary: "Không phát hiện đột biến gen",
            details: `
Thalassemia: Âm tính
Xơ nang tuyến (CFTR): Âm tính
Huntington: Âm tính
BRCA1/BRCA2: Âm tính
Lynch syndrome: Âm tính
Phenylketonuria: Âm tính
Sickle cell: Âm tính

Kết luận: Không phát hiện các đột biến gen thường gặp. Nguy cơ di truyền thấp.`
        },
        bad: {
            summary: "Phát hiện đột biến gen",
            details: `
Thalassemia: DƯƠNG TÍNH (Beta-thalassemia minor)
Xơ nang tuyến (CFTR): Âm tính
Huntington: Âm tính
BRCA1/BRCA2: DƯƠNG TÍNH (BRCA1 c.185delAG)
Lynch syndrome: Âm tính
Phenylketonuria: Âm tính
Sickle cell: Âm tính

Kết luận: Mang gen thalassemia và BRCA1. Nguy cơ cao ung thư vú/buồng trứng.`
        }
    },
    'cancer-screening': {
        good: {
            summary: "Không phát hiện dấu hiệu ung thư",
            details: `
CEA: 2.1 ng/mL (Bình thường: <5.0)
CA 19-9: 18 U/mL (Bình thường: <37)
CA 125: 12 U/mL (Bình thường: <35)
PSA: 1.8 ng/mL (Bình thường: <4.0)
AFP: 4.2 ng/mL (Bình thường: <20)
Beta-hCG: <1 mIU/mL (Bình thường)

Kết luận: Tất cả chỉ số ung thư trong giới hạn bình thường.`
        },
        bad: {
            summary: "Phát hiện chỉ số ung thư cao",
            details: `
CEA: 12.5 ng/mL (CAO - Bình thường: <5.0)
CA 19-9: 85 U/mL (CAO - Bình thường: <37)
CA 125: 68 U/mL (CAO - Bình thường: <35)
PSA: 8.9 ng/mL (CAO - Bình thường: <4.0)
AFP: 45 ng/mL (CAO - Bình thường: <20)
Beta-hCG: 2.5 mIU/mL (Cao)

Kết luận: Nhiều chỉ số ung thư cao. Cần thêm xét nghiệm và chẩn đoán hình ảnh.`
        }
    }
};
