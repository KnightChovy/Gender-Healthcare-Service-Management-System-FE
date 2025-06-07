export const testCategories = [
    {
      id: 'sti',
      name: 'Xét nghiệm STI/STD',
      icon: '🧪',
      description: 'Các bệnh lây truyền qua đường tình dục',
      tests: [
        { id: 'hiv', name: 'HIV', price: '500,000', description: 'Xét nghiệm HIV' },
        { id: 'syphilis', name: 'Giang mai (Syphilis)', price: '300,000', description: 'Xét nghiệm giang mai' },
        { id: 'gonorrhea', name: 'Lậu (Gonorrhea)', price: '400,000', description: 'Xét nghiệm bệnh lậu' },
        { id: 'chlamydia', name: 'Chlamydia', price: '450,000', description: 'Xét nghiệm Chlamydia' },
        { id: 'herpes', name: 'Herpes', price: '600,000', description: 'Xét nghiệm Herpes' },
        { id: 'hepatitis', name: 'Viêm gan B, C', price: '350,000', description: 'Xét nghiệm viêm gan' },
        { id: 'sti_combo', name: 'Combo STI toàn diện', price: '2,500,000', description: 'Gói xét nghiệm tổng hợp' }
      ]
    },
    {
      id: 'reproductive',
      name: 'Xét nghiệm sinh sản',
      icon: '🩺',
      description: 'Kiểm tra sức khỏe sinh sản',
      tests: [
        { id: 'hormone', name: 'Hormone sinh sản', price: '800,000', description: 'FSH, LH, Estrogen, Testosterone' },
        { id: 'fertility', name: 'Đánh giá khả năng sinh sản', price: '1,200,000', description: 'AMH, AFC, Sperm analysis' },
        { id: 'pcos', name: 'Hội chứng buồng trứng đa nang', price: '700,000', description: 'Hormone, siêu âm' },
        { id: 'menopause', name: 'Tiền mãn kinh', price: '600,000', description: 'Hormone mãn kinh' }
      ]
    },
    {
      id: 'general',
      name: 'Xét nghiệm tổng quát',
      icon: '⚕️',
      description: 'Kiểm tra sức khỏe tổng quát',
      tests: [
        { id: 'blood_basic', name: 'Xét nghiệm máu cơ bản', price: '200,000', description: 'CBC, glucose, lipid' },
        { id: 'liver', name: 'Chức năng gan', price: '300,000', description: 'ALT, AST, Bilirubin' },
        { id: 'kidney', name: 'Chức năng thận', price: '250,000', description: 'Creatinine, BUN, Urea' },
        { id: 'thyroid', name: 'Chức năng tuyến giáp', price: '400,000', description: 'TSH, T3, T4' },
        { id: 'diabetes', name: 'Tiểu đường', price: '350,000', description: 'Glucose, HbA1c' }
      ]
    },
    {
      id: 'cancer',
      name: 'Tầm soát ung thư',
      icon: '🔬',
      description: 'Phát hiện sớm ung thư',
      tests: [
        { id: 'cervical', name: 'Ung thư cổ tử cung', price: '800,000', description: 'Pap smear, HPV' },
        { id: 'breast', name: 'Ung thư vú', price: '1,000,000', description: 'Mammography, siêu âm' },
        { id: 'ovarian', name: 'Ung thư buồng trứng', price: '600,000', description: 'CA125, siêu âm' },
        { id: 'prostate', name: 'Ung thư tuyến tiền liệt', price: '500,000', description: 'PSA' }
      ]
    }
  ];
