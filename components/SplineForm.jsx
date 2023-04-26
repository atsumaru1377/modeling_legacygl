import React, { useContext } from 'react';
import { SplineFormContext } from '../context/SplineFormContext';

const SplineForm = () => {
  const { formValues, setFormValues } = useContext(SplineFormContext);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="bg-white bg-opacity-30 backdrop-blur-md rounded-lg p-4 shadow-lg">
      <div className="flex items-center mb-4">
        <input
          id="numSteps"
          name="numSteps"
          type="number"
          value={formValues.numSteps}
          onChange={handleChange}
          step="2"
          min="2"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="numSteps"
          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Default checkbox
        </label>
      </div>
    </div>
  );
};

export default SplineForm;
