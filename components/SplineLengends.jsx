import React from 'react';

const cameraData = [
    { label: 'Alt+Drag', detail: 'Camera Pan' },
    { label: 'Alt+Shift+Drag', detail: 'Camera Zomm' },
];
const modeData = [
    { label: 'V (Default)', detail: 'Move Line' },
    { label: 'A', detail: 'Move Point' },
    { label: 'P', detail: 'Draw New Line' },
];

const SplineLegends = () => {
  return (
    <div className="bg-white bg-opacity-30 backdrop-blur-md rounded-lg mx-8 mb-8 p-4 shadow-lg">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
                <h2 className="text-2xl font-bold mb-2">Camera Control</h2>
                <div className="flex flex-wrap">
                    {cameraData.map((item, index) => (
                        <div key={index} className="flex w-full">
                            <div className="font-semibold w-1/3 mr-4">{item.label}</div>
                            <div className="font-normal w-2/3">{item.detail}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-2">Mode Change</h2>
                <div className="flex flex-wrap">
                    {modeData.map((item, index) => (
                        <div key={index} className="flex w-full">
                            <div className="font-semibold w-1/3 mr-4">{item.label}</div>
                            <div className="font-normal w-2/3">{item.detail}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default SplineLegends;
