import React from 'react';
import { MainData } from '../assets/data';

const ContentComponent = ({ section }) => {
  if (!MainData || !MainData[section]) return null;

  const { title, paragraphs } = MainData[section];

  return (
    <div className="px-16 py-10 container">
      <p className="text-4xl mb-8">{title}</p>
      <div className="space-y-4 text-lg text-gray-700 space-x-5">
        {paragraphs.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>
    </div>
  );
}

export default ContentComponent;
