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

const CampaignCreate = () => {
  const [value, setValue] = useState(null);

  // 파일 업로드
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    console.log('첨부 이미지:', file);
  };
  // 파일 업로드
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log('첨부 파일:', file);
  };

  return (
    <div className='campaignCreateForm'>
      <h1>캠페인 신청하기</h1>
      <div className='campaignCreateBody'>
        <div className='marginBottom10'>
          캠페인 제목
          <TextField
            id="outlined-multiline-flexible"
            label="Multiline"
            multiline
            maxRows={4}
          />
        </div>

        <div className='marginBottom10'>
          캠페인 내용
          <TextField
            id="outlined-multiline-static"
            label="Multiline"
            multiline
            rows={4}
          />
        </div>

        <div className='marginBottom10'>
          캠페인 참가인원
          <TextField
            id="outlined-number"
            label="Number"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>

        <div className='marginBottom10'>
          캠페인 이미지
          <label htmlFor="file-upload">
            <input
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleImageUpload}
            />
            <Button variant="outlined" color="gray" component="span">
              파일 선택
            </Button>
          </label>
        </div>

        <div className='campaignDate'>
          <div>
            캠페인 시작일
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateField', 'DatePicker']}>
                <DatePicker
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  label="Date Picker"
                  format="YYYY/MM/DD"
                  defaultValue={dayjs('2022-04-17')}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          ~
          <div>
            캠페인 마감일
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateField', 'DatePicker']}>
                <DatePicker
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  label="Date Picker"
                  format="YYYY/MM/DD"
                  defaultValue={dayjs('2022-04-17')}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>


        <div className='campaignDate'>
          <div>
            활동 시작일
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateField', 'DatePicker']}>
                <DatePicker
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  label="Date Picker"
                  format="YYYY/MM/DD"
                  defaultValue={dayjs('2022-04-17')}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          ~
          <div>
            활동 마감일
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateField', 'DatePicker']}>
                <DatePicker
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  label="Date Picker"
                  format="YYYY/MM/DD"
                  defaultValue={dayjs('2022-04-17')}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>
        <div>활동이 없는 캠페인은 비워주세요.</div>

        <div className='campaignFundCheck'>
          <Checkbox {...label} defaultChecked />
          <span>펀딩 여부</span>
        </div>

        <div className='marginBottom10'>
          펀딩 목표 금액
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={<InputAdornment position="start">￦</InputAdornment>}
              label="Amount"
            />
          </FormControl>
        </div>

        <label htmlFor="file-upload">
          <input
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
          />
          <div>
            펀딩 승인파일
            <Button variant="outlined" color="gray" component="span">
              파일 선택
            </Button>
          </div>
        </label>

        <Button
          variant="contained"
          color="primary"
          sx={{ fontSize: '1rem', color: 'white', marginTop: '10px' }}>
          제출하기
        </Button>
      </div>
    </div>
  );
};

export { CampaignCreate };