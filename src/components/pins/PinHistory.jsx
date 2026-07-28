import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { formatDateTime } from '../../utils/dateUtils';

export default function PinHistory({ pin }) {
  const steps = [
    { label: 'Entrada', date: pin.entryDate },
    { label: 'Última Atualização', date: pin.updatedAt },
  ];
  if (pin.finishDate) {
    steps.push({ label: 'Finalização', date: pin.finishDate });
  }

  const activeStep = steps.length - 1;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>Histórico</Typography>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step) => (
          <Step key={step.label} completed>
            <StepLabel optional={<Typography variant="caption">{formatDateTime(step.date)}</Typography>}>
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
}
