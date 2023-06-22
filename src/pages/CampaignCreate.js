import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/campaign.css'

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Stepper
import HorizontalLinearStepper from '../campaign/CampaignStepper'

// Checkbox
const label = { inputProps: { 'aria-label': 'Funding Checkbox' } };


// CampaignCreate
const CampaignCreate = () => {
  const navigate = useNavigate();

  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignContent, setCampaignContent] = useState('');
  const [campaignMembers, setCampaignMembers] = useState('');
  const [campaignImage, setCampaignImage] = useState('');
  const [campaignStartDate, setCampaignStartDate] = useState('');
  const [campaignEndDate, setCampaignEndDate] = useState('');
  const [activityStartDate, setActivityStartDate] = useState(null);
  const [activityEndDate, setActivityEndDate] = useState(null);
  const [isFundChecked, setIsFundChecked] = useState(false);
  const [campaignFundGoal, setCampaignFundGoal] = useState(0);
  const [campaignApproveFile, setCampaignApproveFile] = useState('');

  const [selectedImageName, setSelectedImageName] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  // axios Post
  const token = localStorage.getItem('access')
  const axiosCampaignCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', campaignTitle);
    formData.append('content', campaignContent);
    formData.append('members', campaignMembers);
    formData.append('image', campaignImage);
    formData.append('campaign_start_date', campaignStartDate);
    formData.append('campaign_end_date', campaignEndDate);
    if (activityStartDate !== null) {
      formData.append('activity_start_date', activityStartDate);
    }
    if (activityEndDate !== null) {
      formData.append('activity_end_date', activityEndDate);
    }
    formData.append('status', 0);
    formData.append('is_funding', isFundChecked);

    if (isFundChecked && campaignFundGoal !== 0) {
      formData.append('goal', campaignFundGoal);
      formData.append('current', 0);
      formData.append('approve_file', campaignApproveFile);
    }


    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/campaigns/`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        transformRequest: [
          function () {
            return formData;
          },
        ],
      });
      alert("캠페인 신청 성공!");
      navigate("/campaign");
      console.log(response)
    } catch (error) {
      alert("캠페인 신청에 실패했습니다.");
      console.log(error);
      for (const value of formData.values()) {
        console.log(value);
      }
    }
  };


  // 제목
  const handleCampaignTitle = (event) => {
    setCampaignTitle(event.target.value);
  };
  // 내용
  const handleCampaignContent = (event) => {
    setCampaignContent(event.target.value);
  };
  // 참가인원
  const handleCampaignMembers = (event) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^0-9.-]+/g, ''));
    setCampaignMembers(numericValue);
  };
  // 캠페인 시작일
  const handleCampaignStartDate = (date) => {
    setCampaignStartDate(date.toISOString());
  };
  // 캠페인 마감일
  const handleCampaignEndDate = (date) => {
    setCampaignEndDate(date.toISOString());
  };
  // 활동 시작일
  const handleActivityStartDate = (date) => {
    setActivityStartDate(date.toISOString());
  };
  // 활동 마감일
  const handleActivityEndDate = (date) => {
    setActivityEndDate(date.toISOString());
  };
  // 펀딩 체크박스
  const handleFundCheck = (event) => {
    setIsFundChecked(event.target.checked);
  };
  // 펀딩 목표금액
  const handleCampaignFundGoal = (event) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^0-9.-]+/g, ''));
    setCampaignFundGoal(numericValue);
  };


  // 이미지 업로드
  const handleImageUpload = (event) => {
    const image = event.target.files[0];
    console.log('첨부 이미지:', image);
    setSelectedImageName(image.name);
    setCampaignImage(event.target.files[0]);
  };
  // 파일 업로드
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log('첨부 파일:', file);
    setSelectedFileName(file.name);
    setCampaignApproveFile(event.target.files[0]);
  };

  return (
    <div className='campaignCreateForm'>
      <h1>캠페인 신청하기</h1>
      <HorizontalLinearStepper />
      <div className='campaignCreateBody'>
        <div className='marginBottom10'>
          <div className='campaignCreateTitle'>캠페인 제목<span className='campaignCreateStar'>*</span></div>
          <TextField
            id="outlined-multiline-flexible"
            label="제목"
            maxRows={4}
            sx={{
              width: '100%',
            }}
            onChange={handleCampaignTitle}
          />
        </div>

        <div className='marginBottom10'>
          <div className='campaignCreateTitle'>캠페인 내용<span className='campaignCreateStar'>*</span></div>
          <TextField
            id="outlined-multiline-static"
            label="내용"
            multiline
            rows={4}
            sx={{
              width: '100%',
            }}
            onChange={handleCampaignContent}
          />
        </div>

        <div className='marginBottom30'>
          <div className='campaignCreateTitle'>캠페인 참가정원<span className='campaignCreateStar'>*</span></div>
          <TextField
            id="outlined-number"
            label="참가 인원"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              width: '100%',
            }}
            inputProps={{ min: 0 }}
            onChange={handleCampaignMembers}
          />
        </div>

        <div className='marginBottom30'>
          <div className='campaignCreateTitle'>캠페인 첨부 이미지<span className='campaignCreateStar'>*</span></div>
          <TextField
            value={selectedImageName}
            label="첨부 이미지"
            size="small"
            variant="standard"
            readOnly={true}
            disabled
            sx={{ width: "70%" }}
          />
          <label htmlFor="image-upload">
            <input
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              accept='image/jpg,impge/png,image/jpeg,image/gif'
              onChange={handleImageUpload}
            />
            <Button
              variant="outlined"
              color="gray"
              component="div"
              sx={{ marginLeft: '10px' }}
            >
              파일 선택
            </Button>
          </label>
        </div>

        <div className='campaignDate'>
          <div>
            <div className='campaignCreateTitle'>캠페인 시작일<span className='campaignCreateStar'>*</span></div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateField', 'DatePicker']}>
                <DatePicker
                  disablePast
                  value={campaignStartDate}
                  onChange={handleCampaignStartDate}
                  label="날짜를 선택해주세요."
                  format="YYYY-MM-DD"
                  sx={{
                    marginRight: '30px',
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>

          <div>
            <div className='campaignCreateTitle'>캠페인 마감일<span className='campaignCreateStar'>*</span></div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateField', 'DatePicker']}>
                <DatePicker
                  disablePast
                  value={campaignEndDate}
                  onChange={handleCampaignEndDate}
                  label="날짜를 선택해주세요."
                  format="YYYY-MM-DD"
                  sx={{
                    width: '100%',
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>


        <div className='campaignDate'>
          <div>
            <div className='campaignCreateTitle'>활동 시작일</div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateField', 'DatePicker']}>
                <DatePicker
                  disablePast
                  value={activityStartDate}
                  onChange={handleActivityStartDate}
                  label="날짜를 선택해주세요."
                  format="YYYY-MM-DD"
                  sx={{
                    marginRight: '30px',
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>

          <div>
            <div className='campaignCreateTitle'>활동 마감일</div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateField', 'DatePicker']}>
                <DatePicker
                  disablePast
                  value={activityEndDate}
                  onChange={handleActivityEndDate}
                  label="날짜를 선택해주세요."
                  format="YYYY-MM-DD"
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>
        <div className='campaignExplain'>※활동이 없는 캠페인은 비워주세요.</div>


        <div className='campaignFundCheck'>
          <Checkbox
            {...label}
            checked={isFundChecked}
            onChange={handleFundCheck}
          />
          <span>펀딩 여부</span>
        </div>

        <div className='marginBottom30'>
          <div className='campaignCreateTitle'>펀딩 목표 금액</div>
          <FormControl sx={{ width: '100%', }}>
            <InputLabel htmlFor="outlined-adornment-amount">금액</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={<InputAdornment position="start">￦</InputAdornment>}
              label="금액"
              disabled={!isFundChecked}
              inputProps={{ min: 0 }}
              value={campaignFundGoal.toLocaleString()}
              onChange={handleCampaignFundGoal}
            />
          </FormControl>
        </div>

        <div className='marginBottom10'>
          <div className='campaignCreateTitle'>펀딩 첨부 파일</div>
          <TextField
            value={selectedFileName}
            label="첨부 파일"
            size="small"
            variant="standard"
            readOnly={true}
            disabled
            sx={{ width: "70%" }}
          />
          <label htmlFor="file-upload">
            <input
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              disabled={!isFundChecked}
            />
            <Button
              variant="outlined"
              color="gray"
              component="div"
              disabled={!isFundChecked}
              sx={{ marginLeft: '10px' }}
            >
              파일 선택
            </Button>
          </label>
          <div className='campaignExplain'>※캠페인 주최와 관련된 자격 증빙이나, 캠페인 계획서를 제출해주세요.</div>
        </div>

        <Button
          variant="contained"
          color="primary"
          sx={{ fontSize: '1rem', color: 'white', marginTop: '10px' }}
          onClick={axiosCampaignCreate}
        >
          제출하기
        </Button>
      </div>
    </div >
  );
};

export { CampaignCreate };