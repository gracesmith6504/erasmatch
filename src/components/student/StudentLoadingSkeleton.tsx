
import React from "react";

const StudentLoadingSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="h-10 w-60 skeleton rounded-xl mb-6"></div>
      
      <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="h-12 w-full skeleton rounded-lg lg:col-span-2"></div>
          <div className="h-12 w-full skeleton rounded-lg"></div>
          <div className="h-12 w-full skeleton rounded-lg"></div>
          <div className="h-12 w-full skeleton rounded-lg"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="h-80 w-full skeleton rounded-xl"></div>
        ))}
      </div>
    </div>
  );
};

export default StudentLoadingSkeleton;
