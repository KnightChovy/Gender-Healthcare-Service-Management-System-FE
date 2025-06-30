import React, { useState } from "react";

const AddMedicalRecord = ({ patient, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    diagnosis: "",
    symptoms: "",
    treatment: "",
    notes: "",
    followUpDate: "",
    prescription: "",
    vitalSigns: {
      temperature: "",
      bloodPressure: "",
      heartRate: "",
      weight: "",
      height: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVitalSignsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      vitalSigns: {
        ...prev.vitalSigns,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newRecord = {
        id: Date.now(), // Temporary ID
        date: new Date().toISOString().split("T")[0],
        patientId: patient.id,
        patientName: patient.name,
        doctor: "BS. Current Doctor", // Get from current user
        ...formData,
        followUp: formData.followUpDate,
      };

      // Call API to save medical record
      // await medicalRecordService.create(newRecord);

      onSave(newRecord);
      onClose();
    } catch (error) {
      console.error("Error saving medical record:", error);
      alert("Có lỗi xảy ra khi lưu hồ sơ bệnh án");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-xl font-medium text-gray-900">
              Thêm hồ sơ khám bệnh mới
            </h3>
            <p className="text-sm text-gray-500">Bệnh nhân: {patient?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 max-h-[calc(90vh-120px)] overflow-y-auto"
        >
          {/* Vital Signs */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Chỉ số sinh hiệu
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhiệt độ (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.vitalSigns.temperature}
                  onChange={handleVitalSignsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="36.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Huyết áp
                </label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={formData.vitalSigns.bloodPressure}
                  onChange={handleVitalSignsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="120/80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhịp tim (bpm)
                </label>
                <input
                  type="number"
                  name="heartRate"
                  value={formData.vitalSigns.heartRate}
                  onChange={handleVitalSignsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="72"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cân nặng (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.vitalSigns.weight}
                  onChange={handleVitalSignsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chiều cao (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.vitalSigns.height}
                  onChange={handleVitalSignsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="160"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Symptoms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Triệu chứng <span className="text-red-500">*</span>
              </label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mô tả các triệu chứng mà bệnh nhân gặp phải..."
              />
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chẩn đoán <span className="text-red-500">*</span>
              </label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Chẩn đoán bệnh..."
              />
            </div>
          </div>

          {/* Treatment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phương pháp điều trị <span className="text-red-500">*</span>
            </label>
            <textarea
              name="treatment"
              value={formData.treatment}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mô tả phương pháp điều trị, thuốc men, liều lượng..."
            />
          </div>

          {/* Prescription */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đơn thuốc chi tiết
            </label>
            <textarea
              name="prescription"
              value={formData.prescription}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1. Thuốc A - 500mg x 2 viên/ngày x 7 ngày
2. Thuốc B - 250mg x 1 viên/ngày x 5 ngày
..."
            />
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Lời khuyên, lưu ý đặc biệt cho bệnh nhân..."
            />
          </div>

          {/* Follow-up Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày tái khám
            </label>
            <input
              type="date"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Hủy
          </button>
          <div className="space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Lưu nháp
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Đang lưu...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Lưu hồ sơ
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMedicalRecord;
