import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const steps = [
  {
    label: "캠페인 신청하기",
    description: `An ad group contains one or more ads which target a shared set of keywords.
      펀딩이나 캠페인 활동이 없어도 되며, 없는 경우는 비워두라는 등의 자세한 설명..`,
  },
  {
    label: "캠페인 승인받기",
    description: `For each ad campaign that you create, you can control how much
      you're willing to spend on clicks and conversions, which networks
      and geographical locations you want your ads to show on, and more.
      펀딩이 있는 캠페인은 EcoCanvas의 승인을 받은 이후 이루어집니다.. 
      승인 첨부파일은 어떤걸 넣어주세요 등등...`,
  },
  {
    label: "캠페인 진행하기",
    description: `Try out different ad text to see what brings in the most customers,
      and learn how to enhance your ads using features like ad extensions.
      If you run into any problems with your ads, find out how to tell if
      they're running and how to resolve approval issues.
      펀딩 과정이라던가 캠페인 활동이 없어도 된다는 등의 자세한 설명...`,
  },
];

export default function VerticalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 450, margin: "auto", marginTop: "30px" }}>
      <h3 style={{ marginBottom: "10px" }}> 캠페인 진행과정 살펴보기</h3>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? <Typography variant="caption"></Typography> : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1, color: "white" }}
                  >
                    {index === steps.length - 1 ? "완료" : "다음"}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    이전
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>
            캠페인의 모든 과정이 완료되었습니다.
            <br /> EcoCanvas와 함께 지구를 지켜주셔서 감사해요!
          </Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            다시보기
          </Button>
        </Paper>
      )}
    </Box>
  );
}
