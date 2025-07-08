import { CyclesServiceCard } from "./CyclesServiceCard";
import { ServiceCards } from "./ServiceCards";

export const ServiceSection = ({ title, icon, services, category }) => {
  if (!services || services.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 mr-2 text-${
            category === "consultation"
              ? "indigo"
              : category === "cycle"
              ? "pink"
              : "blue"
          }-600`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {icon}
        </svg>
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) =>
          category === "cycle" ? (
            <CyclesServiceCard key={service.service_id} service={service} />
          ) : (
            <ServiceCards
              key={service.service_id}
              service={service}
              category={category}
            />
          )
        )}
      </div>
    </div>
  );
};
