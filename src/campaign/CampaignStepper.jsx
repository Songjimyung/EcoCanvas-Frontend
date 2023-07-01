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
    description: (
      <>
        EcoCanvas와 함께하고싶은 캠페인을 신청해주세요. <br />
        캠페인의 목적, 목표, 계획 및 예산 등에 대한 명확하고 자세한 설명이
        포함되어야 합니다. <br />
        펀딩이나 캠페인 활동이 필요하지 않은 경우는 비워주세요. <br />
        태그에는 어떤 환경문제를 다루는 캠페인인지 작성해주세요. <br />
        별(*)이 달린 항목은 필수로 작성 부탁드립니다.
      </>
    ),
  },
  {
    label: "선정 기준 예시",
    description: (
      <>
        캠페인을 통해 어떤 변화를 이루고자 하는지, 어떤 지표를 사용하여 성과를
        측정할 것인지 설명해야 합니다. <br />
        ⑴ 기존 환경문제와 차별화된 내용을 다루는가 <br />
        ⑵ 현실성 있는 사업목표를 설정하였는가 <br />
        ⑶ 환경문제 해결에 얼마나 도움이 되는가 <br />
        ⑷ 홍보 및 취재에 적극적 협조가 가능한가 <br />
        ⑸ 타 크라우드 펀딩과 중복 문제는 없는가 <br />
      </>
    ),
  },
  {
    label: "펀딩금액 지원 방식",
    description: (
      <>
        ⑴ 펀딩목표액 100% 미달성 시<br />
        - 펀딩된 금액에 맞춰 사업계획서 수정하여 진행. <br />
        또는 펀딩된 금액에 선정단체의 자체 예산을 추가하여 사업 진행 <br />
        - 사업 포기 시 펀딩된 금액은 지급하지 아니함
        <br />
        ⑵ 펀딩목표액 100% 초과 달성시 <br />- 펀딩된 금액에 맞춰 사업계획서
        수정하여 진행
      </>
    ),
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
