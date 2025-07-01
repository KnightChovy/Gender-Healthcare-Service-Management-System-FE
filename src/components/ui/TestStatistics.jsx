import React from "react";

const TestStatisticsCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center">
        <div
          className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mr-4`}
        >
          <i className={`${icon} text-xl`}></i>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          <p className="text-sm text-gray-600">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

const TestChart = ({ data }) => {
  // Simple bar chart using CSS
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        Xét nghiệm theo loại
      </h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm text-gray-600 flex-shrink-0">
              {item.name}
            </div>
            <div className="flex-1 mx-3">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-800 w-8 text-right">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecentTestActivity = ({ recentTests }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "pending":
        return "Chờ thực hiện";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        Hoạt động gần đây
      </h3>
      <div className="space-y-3">
        {recentTests.map((test, index) => (
          <div
            key={index}
            className="flex items-center py-2 border-b border-gray-100 last:border-b-0"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-800">{test.patient_name}</p>
              <p className="text-sm text-gray-600">{test.test_type}</p>
              <p className="text-xs text-gray-500">{test.date}</p>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                test.status
              )}`}
            >
              {getStatusText(test.status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { TestStatisticsCard, TestChart, RecentTestActivity };
