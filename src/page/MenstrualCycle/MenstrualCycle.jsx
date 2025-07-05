import React, { useState, useEffect, useCallback } from 'react';
import Header from './MenstrualCycleItems/Header';
import CycleInputForm from './MenstrualCycleItems/CycleInputForm';
import CurrentStatus from './MenstrualCycleItems/CurrentStatus';
import NotificationSettings from './MenstrualCycleItems/NotificationSettings';
import HealthTips from './MenstrualCycleItems/HealthTips';
import EmailNotifications from './MenstrualCycleItems/EmailNotifications';
import EmailPreview from './MenstrualCycleItems/EmailPreview';
import Navbar from '../../Layouts/LayoutHomePage/Navbar';
import { Footer } from '../../Layouts/LayoutHomePage/Footer';
import { EmailService } from '../../services/emailService';

function MenstrualCycle() {
    const [cycleData, setCycleData] = useState({
        lastPeriodDate: '',
        cycleLength: 28,
        periodLength: 5,
        birthControlTime: '',
        email: '',
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
        detailedInfo: null
    });

    const [currentPhase, setCurrentPhase] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Load saved data on component mount
    useEffect(() => {
        const savedCycleData = localStorage.getItem('menstrualCycleData');
        if (savedCycleData) {
            const parsedData = JSON.parse(savedCycleData);
            setCycleData(parsedData);
        }
    }, []);

    // Move calculatePredictions before useEffect
    const calculatePredictions = useCallback(() => {
        if (!cycleData.lastPeriodDate) return;
        
        const lastPeriod = new Date(cycleData.lastPeriodDate);
        const cycleLength = parseInt(cycleData.cycleLength);
        const periodLength = parseInt(cycleData.periodLength);

        const nextPeriod = new Date(lastPeriod);
        nextPeriod.setDate(lastPeriod.getDate() + cycleLength);

        const ovulationDate = new Date(nextPeriod);
        ovulationDate.setDate(nextPeriod.getDate() - 14);

        const fertilityStart = new Date(ovulationDate);
        fertilityStart.setDate(ovulationDate.getDate() - 5);
        const fertilityEnd = new Date(ovulationDate);
        fertilityEnd.setDate(ovulationDate.getDate() + 1);

        // Calculate detailed monthly info for next 6 cycles
        const detailedInfo = [];
        for (let i = 0; i < 6; i++) {
            const cycleStart = new Date(nextPeriod);
            cycleStart.setDate(nextPeriod.getDate() + (i * cycleLength));
            
            const cycleEnd = new Date(cycleStart);
            cycleEnd.setDate(cycleStart.getDate() + periodLength - 1);
            
            const cycleOvulation = new Date(cycleStart);
            cycleOvulation.setDate(cycleStart.getDate() + cycleLength - 14);
            
            detailedInfo.push({
                month: i + 1,
                periodStart: new Date(cycleStart),
                periodEnd: new Date(cycleEnd),
                ovulation: new Date(cycleOvulation),
                cycleNumber: i + 1
            });
        }

        setPredictions({
            nextPeriod,
            ovulationDate,
            fertilityWindow: { start: fertilityStart, end: fertilityEnd },
            detailedInfo
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

    const saveCycleData = () => {
        if (!cycleData.lastPeriodDate) {
            alert('⚠️ Vui lòng nhập ngày kinh nguyệt cuối cùng!');
            return;
        }

        if (!cycleData.email) {
            alert('⚠️ Vui lòng nhập email để nhận thông báo!');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cycleData.email)) {
            alert('⚠️ Vui lòng nhập địa chỉ email hợp lệ!');
            return;
        }

        try {
            // Save to localStorage
            localStorage.setItem('menstrualCycleData', JSON.stringify(cycleData));
            
            // Setup email notifications
            setupEmailNotifications();
            
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
            
        } catch (error) {
            console.error('Error saving cycle data:', error);
            alert('❌ Có lỗi xảy ra khi lưu dữ liệu!');
        }
    };

    const setupEmailNotifications = () => {
        // Create notifications for upcoming periods and ovulation
        const notifications = [];
        const emailsToSchedule = [];
        
        if (predictions.detailedInfo) {
            predictions.detailedInfo.forEach((cycle, index) => {
                if (cycleData.notifications.period) {
                    // Period reminder 2 days before
                    const periodReminder = new Date(cycle.periodStart);
                    periodReminder.setDate(periodReminder.getDate() - 2);
                    
                    const periodNotification = {
                        id: `period_${index}_${Date.now()}`,
                        type: 'period',
                        title: 'Nhắc nhở chu kỳ kinh nguyệt',
                        message: `Chu kỳ kinh nguyệt sắp đến vào ngày ${cycle.periodStart.toLocaleDateString('vi-VN')}. Hãy chuẩn bị sẵn sàng!`,
                        scheduledDate: periodReminder,
                        email: cycleData.email,
                        read: false
                    };
                    
                    notifications.push(periodNotification);
                    
                    // Schedule email
                    emailsToSchedule.push({
                        ...periodNotification,
                        scheduledDate: periodReminder.toISOString()
                    });
                }

                if (cycleData.notifications.ovulation) {
                    // Ovulation reminder 1 day before
                    const ovulationReminder = new Date(cycle.ovulation);
                    ovulationReminder.setDate(ovulationReminder.getDate() - 1);
                    
                    const ovulationNotification = {
                        id: `ovulation_${index}_${Date.now()}`,
                        type: 'ovulation',
                        title: 'Nhắc nhở ngày rụng trứng',
                        message: `Ngày rụng trứng dự kiến vào ${cycle.ovulation.toLocaleDateString('vi-VN')}. Đây là thời điểm thụ thai cao nhất!`,
                        scheduledDate: ovulationReminder,
                        email: cycleData.email,
                        read: false
                    };
                    
                    notifications.push(ovulationNotification);
                    
                    // Schedule email
                    emailsToSchedule.push({
                        ...ovulationNotification,
                        scheduledDate: ovulationReminder.toISOString()
                    });
                }
            });
        }

        // Save notifications to localStorage
        const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const updatedNotifications = [...existingNotifications, ...notifications];
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

        // Schedule emails using EmailService
        emailsToSchedule.forEach(email => {
            EmailService.scheduleEmail(email);
        });

        console.log('Email notifications scheduled:', emailsToSchedule);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
            <Navbar />
            
            {/* Success Message */}
            {showSuccessMessage && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
                    ✅ Đã lưu thông tin và thiết lập thông báo email thành công!
                </div>
            )}
            
            <div className="py-8">
                <Header />

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 px-4 sm:px-6 lg:px-8">
                    <CycleInputForm
                        cycleData={cycleData}
                        onDataChange={handleCycleDataChange}
                        onSave={saveCycleData}
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

                    <div className="lg:col-span-2">
                        <EmailNotifications cycleData={cycleData} />
                    </div>

                    <div className="lg:col-span-2">
                        <EmailPreview />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default MenstrualCycle;