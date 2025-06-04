import React from 'react';
import { useState } from 'react';
import '../Register.css';

function GenderChoice({ onChange }) {
    const [selectedGender, setSelectedGender] = useState('M');

    const handleGenderChange = (value) => {
        setSelectedGender(value);
        if(onChange) {
            onChange('gender', value);
        }
    }

    return ( 
        <div className="gender-choice">
            <span style={{ display: 'flex' }}>Giới tính (<span style={{ marginTop: '2px' }}>*</span>)</span>
            <div className="gender-options">
                <label className="gender-item">
                    Nam <input type="radio" name="gender" value="M" checked={selectedGender === 'M'} onChange={(e) => handleGenderChange(e.target.value)} />
                </label>
                <label className="gender-item">
                    Nữ <input type="radio" name="gender" value="F" checked={selectedGender === 'F'} onChange={(e) => handleGenderChange(e.target.value)} />
                </label>
            </div>
        </div>
     );
}

export default GenderChoice;