// Test prescription data để debug PDF generation
export const testPrescription = {
    id: "PRESC_1704203400000",
    patientId: "PAT_001",
    patientName: "Nguyễn Văn Test",
    doctorId: "DOCTOR_001", 
    doctorName: "BS. Nguyễn Văn A",
    createdAt: new Date().toISOString(),
    medicines: [
        {
            id: "MED_001",
            name: "Paracetamol",
            genericName: "Acetaminophen",
            dosage: "1 viên x 3 lần/ngày",
            duration: "5-7 ngày",
            notes: "Uống sau ăn"
        },
        {
            id: "MED_002", 
            name: "Amoxicillin",
            genericName: "Amoxicillin trihydrate",
            dosage: "1 viên x 2 lần/ngày",
            duration: "7 ngày",
            notes: "Uống đủ liều"
        }
    ],
    generalAdvice: "Nghỉ ngơi đầy đủ, uống nhiều nước, tái khám sau 7 ngày nếu không khỏi.",
    status: "active"
};

// Function để test PDF generation
export const testPDFGeneration = async () => {
    try {
        console.log('Testing PDF generation with test data...');
        console.log('Test prescription:', testPrescription);
        
        // Import jsPDF dynamically để test
        const { default: jsPDF } = await import('jspdf');
        await import('jspdf-autotable');
        
        console.log('jsPDF loaded successfully');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        console.log('PDF instance created');
        
        pdf.setFontSize(16);
        pdf.text('TEST PDF GENERATION', 20, 20);
        
        console.log('Basic text added');
        
        pdf.save('test.pdf');
        console.log('Test PDF saved successfully');
        
        return true;
        
    } catch (error) {
        console.error('Test failed:', error);
        return false;
    }
};
