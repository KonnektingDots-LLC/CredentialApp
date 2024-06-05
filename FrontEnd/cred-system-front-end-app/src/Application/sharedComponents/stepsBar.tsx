import { StepIndicator, StepIndicatorStep } from "@trussworks/react-uswds";

interface SSBProps {
  stepNumber: number;
  stepLabels: string[];
}

const StepsBar = ({ stepNumber, stepLabels }: SSBProps) => {
  const setStatus = (stepNum: number, progressNumber: number) => {
    if (progressNumber > stepNum) {
      return "complete";
    } else if (progressNumber < stepNum) {
      return "incomplete";
    } else {
      return "current";
    }
  };

  return (
    <StepIndicator counters="small" headingLevel="h4">
      {stepLabels.map((stepLabel: string, index) => (
        <StepIndicatorStep
          key={stepLabel}
          label={stepLabel}
          status={setStatus(index + 1, stepNumber)}
        />
      ))}
    </StepIndicator>
  );
};

export default StepsBar;
