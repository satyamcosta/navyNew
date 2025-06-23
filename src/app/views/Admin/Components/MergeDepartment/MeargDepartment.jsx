import React, { createContext, useMemo, useState } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import MeargDepartmentForm from './MeargDepartmentForm';
import MeargDepartmentTable from './MeargDepartmentTable';
import { DialogContent, Grid, Paper } from '@material-ui/core';
import './mearg.css';
import { useSelector } from 'react-redux';

export const SendFormikDatainTable = createContext();

export default function HorizontalLinearStepper({selectMergeDept,handleMergeDeptClose}) {

    const theme = useSelector((state)=>state.theme)
   

    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());

    const [departmentList, setDepartmentList] = useState([])

    const [department1, setDepartment1] = useState([])

    const [department, setDepartment] = useState(null)

    const steps = getSteps();


    function getSteps() {
        return ['DEPARTMENT MERGE', 'FILES IN PROGRESS'];
    }

    function getStepContent(step) {
        switch (step) {
            case 0:
                return <MeargDepartmentForm handleNext={handleNext} />;
            case 1:
                return <MeargDepartmentTable handleBack={handleBack} />;
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


    const contextValue = useMemo(() => ({
        setDepartmentList,
        departmentList,
        setDepartment,
        department,
        setDepartment1,
        department1,
        selectMergeDept,
        handleMergeDeptClose
    }), [setDepartmentList, departmentList, setDepartment, department, setDepartment1, department1, selectMergeDept, handleMergeDeptClose]);
    
    return (
        <>
         {/* <DialogContent> */}
        <SendFormikDatainTable.Provider
           value={contextValue} >
            <Grid 
                
            >
                <Paper
                 
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
        </SendFormikDatainTable.Provider>
        {/* </DialogContent> */}
        </>
       

     
    );
}
