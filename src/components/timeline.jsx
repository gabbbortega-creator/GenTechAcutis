import React, { useState } from 'react';

import { timelineData } from '../assets/timelinedata';

const Timeline = () => {
  const itemsPerPage = 5;
  const totalPages = Math.ceil(timelineData.length / itemsPerPage);
  const [page, setPage] = useState(0);
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));
  const startIdx = page * itemsPerPage;
  const currentItems = timelineData.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="container w-full px-4 py-16">
      {/* <p className="text-4xl text-center text-[#1e3b8a] mb-8 py-5">Timeline of Carlo Acutis</p> */}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {currentItems.map((item, idx) => (
          <div
            key={idx}
            // className="bg-white shadow-lg rounded-lg p-4 border-l-4"
            className="border-l-1 border-[#fbcf5f] px-4 py-5 mb-8"
            // style={{ borderColor: item.color || '#1e3b8a' }}
          >
            <div className="text-[#1e3b8a] font-extralight text-3xl mb-2">{item.year}</div>
            <p className="text-sm text-gray-700">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="relative flex justify-center items-center mt-6 space-x-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={page === 0}
          className="absolute left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none disabled:opacity-30"
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-[#1e3b8a] group-focus:outline-none">
            <svg className="w-4 h-4 text-[#1e3b8a]" fill="none" viewBox="0 0 6 10" xmlns="http://www.w3.org/2000/svg">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>

        <div className="flex space-x-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-3 h-3 rounded-full ${
                i === page ? 'bg-[#1e3b8a]' : 'bg-[#1e3b8a]/30'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={page === totalPages - 1}
          className="absolute right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none disabled:opacity-30"
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-[#1e3b8a] group-focus:outline-none">
            <svg className="w-4 h-4 text-[#1e3b8a]" fill="none" viewBox="0 0 6 10" xmlns="http://www.w3.org/2000/svg">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Timeline;
