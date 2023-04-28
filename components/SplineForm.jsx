import React, { useContext } from 'react';
import SplineFormContext from '../context/SplineFormContext';

const formData = [{
        id : "showControlPoints",
        label : "Show Control Points"
    },{
        id : "showSamplePoints",
        label : "Show Sample Points"
    },{
        id : "quadratic",
        label : "Draw Quadratic (3rd) Bezier"
    },{
        id : "nth",
        label : "Draw n-th Bezier"
    },{
        id : "adjustSample",
        label : "Draw Bezier with Adjusted Sampling"
    },{
        id : "rational",
        label : "Draw Rational Bezier"
    },{
        id : "splineUniform",
        label : "Draw CutMull Rom Spline with Uniform knots"
    },{
        id : "splineChordal",
        label : "Draw CutMull Rom Spline with Chordal knots"
    },{
        id : "splineCentripetal",
        label : "Draw CutMull Rom Spline with Centripetal knots"
    },{
        id : "yuksel",
        label : "Draw Yuksel Curve"
    },{
        id : "illustrator",
        label : "Draw Curve like Adobe Illustrator"
    }
];

const SplineForm = () => {
    const { formValues, setFormValues } = useContext(SplineFormContext);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <div className="bg-white bg-opacity-30 backdrop-blur-md rounded-lg m-4 p-4 shadow-lg w-1/2">
            <div className="flex items-center " key="00">
                <input
                    id="numSteps"
                    name="numSteps"
                    type="number"
                    min="2"
                    step="2"
                    value={formValues.numSteps}
                    onChange={handleChange}
                    className="h-4 w-12 pl-1"
                />
                <label htmlFor="numSamples" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Number of Samples
                </label>
            </div>
            {formData.map((item,index) => (
                <div className="flex items-center mt-4" key={index}>
                    <input
                        id={item.id}
                        name={item.id}
                        type="checkbox"
                        checked={formValues[item.id]}
                        onChange={handleChange}
                        className="w-4 h-4 text-yellow-500 accent-yellow-500 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 dark:focus:ring-yellow-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor={item.id} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {item.label}
                    </label>
                </div>
            ))}
    </div>
  );
};

export default SplineForm;
