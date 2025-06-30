import React, { useState, useEffect, useCallback } from 'react';
import Header from './MenstrualCycleItems/Header';
import CycleInputForm from './MenstrualCycleItems/CycleInputForm';
import CurrentStatus from './MenstrualCycleItems/CurrentStatus';
import NotificationSettings from './MenstrualCycleItems/NotificationSettings';
import HealthTips from './MenstrualCycleItems/HealthTips';
import Navbar from '../../Layouts/LayoutHomePage/Navbar';
import { Footer } from '../../Layouts/LayoutHomePage/Footer';

function MenstrualCycle() {
    const [cycleData, setCycleData] = useState({
        lastPeriodDate: '',
        cycleLength: 28,
        periodLength: 5,
        birthControlTime: '',
        notifications: {
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

    // Move calculatePredictions before useEffect
    const calculatePredictions = useCallback(() => {
        if (!cycleData.lastPeriodDate) return;
        
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
    }, [cycleData.lastPeriodDate, cycleData.cycleLength, cycleData.periodLength]);

    // Now useEffect can safely use calculatePredictions
    useEffect(() => {
        if (cycleData.lastPeriodDate) {
            calculatePredictions();
        }
    }, [cycleData.lastPeriodDate, cycleData.cycleLength, cycleData.periodLength, calculatePredictions]);

    const handleCycleDataChange = (newData) => {
        setCycleData(prev => ({
            ...prev,
            ...newData
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
            <Navbar />
            
            <div className="py-8">
                <Header />

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 px-4 sm:px-6 lg:px-8">
                    <CycleInputForm
                        cycleData={cycleData}
                        onDataChange={handleCycleDataChange}
                    />

                    <CurrentStatus
                        predictions={predictions}
                        currentPhase={currentPhase}
                    />

                    <HealthTips currentPhase={currentPhase} />

                    <NotificationSettings
                        notifications={cycleData.notifications}
                        onNotificationChange={handleCycleDataChange}
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default MenstrualCycle;