// components/Card.tsx

import React from 'react';
import Image from 'next/image';

const Card = ({ title, content, imgUrl }) => {
  return (
    <div className="bg-white bg-opacity-30 backdrop-blur-md rounded-lg p-4 shadow-lg  hover:bg-yellow-400">
      {imgUrl && (
        <Image
          src={imgUrl}
          alt={title}
          className="w-full h-48 object-cover rounded-lg"
        />
      )}
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Card;
