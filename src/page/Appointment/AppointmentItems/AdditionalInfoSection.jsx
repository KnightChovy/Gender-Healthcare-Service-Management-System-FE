import React from 'react'

function AdditionalInfoSection({ formData, onChange }) {
    return (  
        <div className="form-section">
            <h3>📝 Thông tin bổ sung</h3>
            
            <div className="form-group" style={{ display: 'block' }}>
                <label htmlFor="priority">Mức độ ưu tiên</label>
                <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={onChange}
                >
                    <option value="normal">Bình thường</option>
                    <option value="urgent">Khẩn cấp</option>
                    <option value="high">Cao</option>
                </select>
            </div>

            <div className="form-group" style={{ display: 'block' }}>
                <label htmlFor="symptoms">Triệu chứng/Lý do khám</label>
                <textarea
                    id="symptoms"
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={onChange}
                    placeholder="Mô tả các triệu chứng hoặc lý do bạn muốn tư vấn..."
                    rows="4"
                />
            </div>

            <div className="form-group" style={{ display: 'block' }}>
                <label htmlFor="notes">Ghi chú thêm</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={onChange}
                    placeholder="Yêu cầu đặc biệt hoặc thông tin bổ sung..."
                    rows="3"
                />
            </div>
        </div>
    );
}

export default AdditionalInfoSection;