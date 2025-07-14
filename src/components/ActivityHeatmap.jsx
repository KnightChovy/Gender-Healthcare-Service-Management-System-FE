import React from 'react';

const ActivityHeatmap = () => {
    const generateHeatmapData = () => {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const testOrders = JSON.parse(localStorage.getItem('testOrders') || '[]');
        
        const data = {};
        const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        const hours = Array.from({ length: 24 }, (_, i) => i);
        
        // Initialize data structure
        days.forEach(day => {
            data[day] = {};
            hours.forEach(hour => {
                data[day][hour] = 0;
            });
        });
        
        // Count activities by day and hour
        [...appointments, ...testOrders].forEach(item => {
            if (item.timestamp) {
                const date = new Date(item.timestamp);
                const dayOfWeek = days[date.getDay()];
                const hour = date.getHours();
                data[dayOfWeek][hour]++;
            }
        });
        
        // Find max value for scaling
        let maxValue = 0;
        Object.values(data).forEach(dayData => {
            Object.values(dayData).forEach(value => {
                maxValue = Math.max(maxValue, value);
            });
        });
        
        return { data, maxValue };
    };

    const { data, maxValue } = generateHeatmapData();
    
    const getIntensity = (value) => {
        if (maxValue === 0) return 0;
        return Math.min(value / maxValue, 1);
    };
    
    const getColor = (intensity) => {
        if (intensity === 0) return 'bg-gray-100';
        if (intensity <= 0.25) return 'bg-blue-200';
        if (intensity <= 0.5) return 'bg-blue-400';
        if (intensity <= 0.75) return 'bg-blue-600';
        return 'bg-blue-800';
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mật độ hoạt động theo giờ trong tuần
            </h3>
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                    {/* Hour labels */}
                    <div className="flex">
                        <div className="w-20"></div>
                        {Array.from({ length: 24 }, (_, i) => (
                            <div key={i} className="w-6 text-xs text-center text-gray-500">
                                {i}
                            </div>
                        ))}
                    </div>
                    
                    {/* Heatmap grid */}
                    {Object.entries(data).map(([day, hours]) => (
                        <div key={day} className="flex items-center">
                            <div className="w-20 text-sm text-gray-700 pr-2 text-right">
                                {day}
                            </div>
                            {Object.entries(hours).map(([hour, value]) => (
                                <div
                                    key={`${day}-${hour}`}
                                    className={`w-6 h-6 m-0.5 rounded ${getColor(getIntensity(value))}`}
                                    title={`${day} ${hour}:00 - ${value} hoạt động`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Legend */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>Ít hoạt động</span>
                <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-gray-100 rounded"></div>
                    <div className="w-4 h-4 bg-blue-200 rounded"></div>
                    <div className="w-4 h-4 bg-blue-400 rounded"></div>
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <div className="w-4 h-4 bg-blue-800 rounded"></div>
                </div>
                <span>Nhiều hoạt động</span>
            </div>
            
            <div className="mt-2 text-center text-sm text-gray-500">
                Tổng cộng {Object.values(data).reduce((sum, day) => 
                    sum + Object.values(day).reduce((daySum, hour) => daySum + hour, 0), 0
                )} hoạt động
            </div>
        </div>
    );
};

export default ActivityHeatmap;
