import React, { useState, createContext } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { Grid, Paper } from '@material-ui/core';
import SplitDptForm from './SplitDptForm';
import SplidDptTable from './SplidDptTable';
import './split.css'
import { DialogContent, IconButton } from '@mui/material';
import { CancelOutlined } from '@material-ui/icons';

export const Resiverolesdata = createContext();

export default function SplitDepartmentDisplay({handleSplitDeptClose}) {
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());

    const [rolesdata, setRolesdata] = useState([])

    const [depData, setDepData] = useState([])


    const [depDatazero, setDepDatazero] = useState([])


    const [deptnamedata, setDeptnamedata] = useState([])

    const steps = getSteps();


    function getSteps() {
        return ['SPLIT DEPARTMENT', 'FILES IN PROGRESS'];
    }

    function getStepContent(step) {
        switch (step) {
            case 0:
                return <SplitDptForm handleNext={handleNext} />;
            case 1:
                return <SplidDptTable handleBack={handleBack} />;
            default:
                return '';
        }
    }

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };


    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <>

        <Resiverolesdata.Provider
            value={{
                setRolesdata, rolesdata,
                setDepData, depData,
                setDepDatazero, depDatazero,
                setDeptnamedata, deptnamedata,
                handleSplitDeptClose
            }} >
                 
            <Grid
                // style={{ border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}` }}
            > 
            
                <Paper
                 
                    style={{ width: "100%", height: "100%" }}
                >
                 
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};

                            if (isStepSkipped(index)) {
                                stepProps.completed = false;
                            }
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel  {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {
                        <Grid >
                            {activeStep === steps.length ? null : (
                                <h6 >
                                    {getStepContent(activeStep)}
                                </h6>
                            )}
                        </Grid>
                    }
                </Paper>
            </Grid >
        </Resiverolesdata.Provider>
        </>
    );
}
