import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/campaign.css'

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';



// Datepickers

// Checkbox
const label = { inputProps: { 'aria-label': 'Funding Checkbox' } };


// CampaignCreate
const CampaignCreate = () => {
  const [value, setValue] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [actStartDate, setActStartDate] = useState('');
  const [actEndDate, setActEndDate] = useState('');
  const [isFundChecked, setIsFundChecked] = useState(false);
  const [selectedImageName, setSelectedImageName] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');


  // 펀딩 체크박스
  const handleFundCheck = (event) => {
    setIsFundChecked(event.target.checked);
  };

  // 이미지 업로드
  const handleImageUpload = (event) => {
    const image = event.target.files[0];
    console.log('첨부 이미지:', image);
    handleIamgeName(event);
  };
  // 파일 업로드
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log('첨부 파일:', file);
    handleFileName(event);
  };

  // 파일이름
  const handleIamgeName = (event) => {
    const image = event.target.files[0];
    setSelectedImageName(image.name);
  };
  // 이미지이름
  const handleFileName = (event) => {
    const file = event.target.files[0];
    setSelectedFileName(file.name);
  };


  return (
    <div className='campaignCreateForm'>
      <h1>캠페인 신청하기</h1>
      <div className='campaignCreateBody'>
        <div className='marginBottom10'>
          <div className='campaignCreateTitle'>캠페인 제목<span className='campaignCreateStar'>*</span></div>
          <TextField
            id="outlined-multiline-flexible"
            label="제목"
            multiline
            maxRows={4}
            sx={{
              width: '100%',
            }}
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
          />
        </div>

        <div className='marginBottom10'>
          <div className='campaignCreateTitle'>캠페인 참가인원<span className='campaignCreateStar'>*</span></div>
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
          />
        </div>

        <div className='marginBottom10'>
          <div className='campaignCreateTitle'>캠페인 이미지<span className='campaignCreateStar'>*</span></div>
          <TextField
            value={selectedImageName}
            label="이미지"
            id="standard-size-small"
            size="small"
            variant="standard"
            readOnly={true}
          />
          <label htmlFor="image-upload">
            <input
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              accept='image/jpg,impge/png,image/jpeg,image/gif'
              onChange={handleImageUpload}
            />
            <Button variant="outlined" color="gray" component="div">
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
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  label="날짜를 선택해주세요."
                  format="YYYY/MM/DD"
                  defaultValue={dayjs('2022-04-17')}
                  sx={{
                    width: '100%',
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
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  label="날짜를 선택해주세요."
                  format="YYYY/MM/DD"
                  defaultValue={dayjs('2022-04-17')}
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
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  label="날짜를 선택해주세요."
                  format="YYYY/MM/DD"
                  defaultValue={dayjs('2022-04-17')}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>

          <div>
            <div className='campaignCreateTitle'>활동 마감일</div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateField', 'DatePicker']}>
                <DatePicker
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  label="날짜를 선택해주세요."
                  format="YYYY/MM/DD"
                  defaultValue={dayjs('2022-04-17')}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>
        <div className='campaignActivityEmpty'>※활동이 없는 캠페인은 비워주세요.</div>


        <div className='campaignFundCheck'>
          <Checkbox
            {...label}
            checked={isFundChecked}
            onChange={handleFundCheck}
          />
          <span>펀딩 여부</span>
        </div>

        <div className='marginBottom10'>
          <div className='campaignCreateTitle'>펀딩 목표 금액</div>
          <FormControl sx={{ width: '100%', }}>
            <InputLabel htmlFor="outlined-adornment-amount">금액</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={<InputAdornment position="start">￦</InputAdornment>}
              label="금액"
              disabled={!isFundChecked}
            />
          </FormControl>
        </div>

        <div>
          <div className='campaignCreateTitle'>펀딩 승인파일</div>
          <TextField
            value={selectedFileName}
            label="파일 이름"
            id="standard-size-small"
            size="small"
            variant="standard"
            readOnly={true}
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
            >
              파일 선택
            </Button>
          </label>
        </div>

        <Button
          variant="contained"
          color="primary"
          sx={{ fontSize: '1rem', color: 'white', marginTop: '10px' }}>
          제출하기
        </Button>
      </div>
    </div >
  );
};

export { CampaignCreate };