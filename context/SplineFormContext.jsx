import React, { createContext, useState } from 'react';

const SplineFormContext = createContext(null);

export const SplineFormContextProvider = ({ children }) => {
    const [formValues, setFormValues] = useState({
        numSteps: 20,
        showControlPoints: true,
        showSamplePoints: true,
        quadratic: false,
        nth: false,
        adjustSample: false,
        rational: false,
        splineUniform: false,
        splineChordal: false,
        splineCentripetal: false,
        yuksel: false,
        illustrator: false
    });

    return (
        <SplineFormContext.Provider value={{ formValues, setFormValues }}>
            {children}
        </SplineFormContext.Provider>
    );
};

export default SplineFormContext;
