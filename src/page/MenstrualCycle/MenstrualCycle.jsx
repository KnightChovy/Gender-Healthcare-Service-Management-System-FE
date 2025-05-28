import React, { useState } from 'react';
import Header from './MenstrualCycleItems/Header';

function MenstrualCycle() {
    const [cycleData, setCycleData] = useState({
        lastPeriodDate: '',
        cycleLength: 28,
        periodLength: 5,
        birthControlTime: '',
        notification: {
            ovulation: true,
            fertility: true,
            period: true,
            birthControl: true
        }
    });

    const [predictions, setPredictions] = useState({
        nextPeriod: null,
        ovulationDay: null,
        fertilityWindow: {start: null, end: null },
    });

    const [currentPhase, setCurrentPhase] = useState('');

    const calculatePredictions = () => {
        const lastPeriod = new Date(cycleData.lastPeriodDate);
        const cycleLength = parseInt(cycleData.cycleLength);

        const nextPeriod = new Date(lastPeriod);
        nextPeriod.setDate(lastPeriod.getDate() + cycleLength);

        const ovulationDate = new Date(nextPeriod);
        ovulationDate.setDate(nextPeriod.getDate() - 14);

        const fertilityStart = new Date(ovulationDate);
        fertilityStart.setDate(ovulationDate.getDate() - 5);
        const fertilityEnd = new Date(ovulationDate);
        fertilityEnd.setDate(ovulationDate.getDate() + 1);

        setPredictions({
            nextPeriod,
            ovulationDate,
            fertilityWindow: { start: fertilityStart, end: fertilityEnd },
        });

        const today = new Date();
        const daysSinceLastPeriod = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));

        if (daysSinceLastPeriod < cycleData.periodLength) {
            setCurrentPhase('Kì kinh nguyệt');
        } else if (daysSinceLastPeriod >= 10 && daysSinceLastPeriod < 16) {
            setCurrentPhase('Kì rụng trứng');
        } else if (daysSinceLastPeriod >= 16 && daysSinceLastPeriod <= 25) {
            setCurrentPhase('Kì hoàng thể');
        } else {
            setCurrentPhase('Kì nang trứng');
        }
    };

    const handleCycleDataChange = (newData) => {
        setCycleData(prev => ({
            ...prev,
            ...newData
        }));
    }

    return (
        <Header />
    );
}

export default MenstrualCycle;