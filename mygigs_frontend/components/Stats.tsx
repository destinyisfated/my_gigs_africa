import React from "react";

const stats = [
  { value: "5,000+", label: "Active Gigs" },
  { value: "20,000+", label: "Freelancers" },
  { value: "15+", label: "African Countries" },
  { value: "95%", label: "Satisfaction Rate" },
];

export function Stats() {
  return (
    <div className="bg-white py-5 md:py-10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-800">
                {stat.value}
              </span>
              <span className="mt-2 text-sm sm:text-base text-gray-600 font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
