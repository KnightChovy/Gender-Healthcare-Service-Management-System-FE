import React from "react";

export const ServiceCard = (props) => {
  const { service, isSelected, onChange, formatPrice } = props;
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={`service-${service.service_id}`}
          name={`service-${service.service_id}`}
          type="checkbox"
          checked={isSelected}
          onChange={() => onChange(service)}
          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
      </div>
      <div className="ml-3 text-sm flex-1">
        <label
          htmlFor={`service-${service.service_id}`}
          className="font-medium text-gray-700 flex justify-between"
        >
          <span>{service.name}</span>
          <span className="font-semibold text-blue-600">
            {formatPrice(service.price)}
          </span>
        </label>
        <p className="text-gray-500">{service.description}</p>
        {isSelected && (
          <div className="mt-2 text-xs bg-blue-50 border border-blue-100 p-2 rounded">
            <p className="font-medium text-gray-700">Hướng dẫn chuẩn bị:</p>
            <p className="text-gray-600">{service.preparation_guidelines}</p>
          </div>
        )}
      </div>
    </div>
  );
};
