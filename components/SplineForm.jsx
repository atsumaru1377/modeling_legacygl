import React, { useContext } from 'react';
import SplineFormContext from '../context/SplineFormContext';

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
    <div className="bg-white bg-opacity-30 backdrop-blur-md rounded-lg p-4 shadow-lg w-1/2">
      <div className="flex items-center mb-4">
        <input
          id="showControlPoints"
          type="checkbox"
          value={formValues.showControlPoints}
          onChange={handleChange}
          className="w-4 h-4 text-yellow-500 accent-yellow-500 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 dark:focus:ring-yellow-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor="numSteps" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          Number of Steps
        </label>
      </div>
    </div>
  );
};

export default SplineForm;
