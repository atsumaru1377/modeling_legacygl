import React from 'react';

const referenceData = [
    { label: 'GitHub', detail: 'https://github.com/atsumaru1377/modeling_legacygl' },
];

const IKReference = () => {
  return (
    <div className="bg-white bg-opacity-30 backdrop-blur-md rounded-lg mx-8 mb-8 p-4 shadow-lg">
        <div>
            <h2 className="text-2xl font-bold mb-2">Reference</h2>
            <div className="flex flex-wrap">
                {referenceData.map((item, index) => (
                    <div key={index} className="flex w-full">
                        <div className="font-semibold w-1/5 mr-4">{item.label}</div>
                        <a target="_blank" className="font-normal w-4/5 text-yellow-500 hover:text-yellow-700 underline" href={item.detail}>{item.detail}</a>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default IKReference;
