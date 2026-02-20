import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  Alert,
  LinearProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../hooks/useOnboarding';
import CompanySetup from './CompanySetup';
import OrganizationStructure from './OrganizationStructure';
import JobPositions from './JobPositions';
import InviteMembers from './InviteMembers';

const steps = [
  'Company Information',
  'Organization Structure',
  'Job Positions',
  'Invite Team Members',
  'Complete',
];

const OnboardingWizard: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const { getStatus, isLoading } = useOnboarding();
  const navigate = useNavigate();

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const status = await getStatus();
      if (status.setup_complete) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Failed to check onboarding status');
    }
  };

  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepComplete = (step: number) => {
    setCompleted((prev) => ({ ...prev, [step]: true }));
    handleNext();
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <CompanySetup
            onComplete={() => handleStepComplete(0)}
            setCompanyId={setCompanyId}
          />
        );
      case 1:
        return (
          <OrganizationStructure
            onComplete={() => handleStepComplete(1)}
            companyId={companyId}
          />
        );
      case 2:
        return <JobPositions onComplete={() => handleStepComplete(2)} />;
      case 3:
        return <InviteMembers onComplete={() => handleStepComplete(3)} />;
      case 4:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" gutterBottom>
              Setup Complete!
            </Typography>
            <Typography variant="body1" paragraph>
              Your organization has been successfully configured.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to ERP System Setup
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Let's get your organization configured. Follow the steps below to set up your company.
        </Typography>

        <Stepper activeStep={activeStep} sx={{ my: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps.length - 1 && (
              <Button onClick={() => navigate('/dashboard')}>Finish</Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default OnboardingWizard;