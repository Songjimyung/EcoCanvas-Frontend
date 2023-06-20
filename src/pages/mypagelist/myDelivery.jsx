import Sidebar from "../../components/mypageSidebar/MypageSidebar"
import "../../components/mypageSidebar/mypageSidebar.css"
import React, { useState } from 'react';
import { Paper, Typography, Grid, TextField, Button, MenuItem } from '@mui/material';

const DeliveryTracking = () => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const deliveryCompanies = [
    {
      id: 'kr.cupost',
      name: 'CU 편의점택배',
      tel: '+8215771287'
    },
    {
      id: 'kr.cjlogistics',
      name: 'CJ대한통운',
      tel: '+8215881255'
    },
    {
      id: 'kr.cvsnet',
      name: 'GS Postbox 택배',
      tel: '+8215771287'
    },
    {
      id: "kr.epost",
      name: "우체국 택배",
      tel: "+8215881300"
    },
    {
      id: "kr.hanjin",
      name: "한진택배",
      tel: "+8215880011"
    },
    {
      id: "kr.kdexp",
      name: "경동택배",
      tel: "+8218995368"
    },
    {
      id: "kr.logen",
      name: "로젠택배",
      tel: "+8215889988"
    },
    {
      id: "kr.lotte",
      name: "롯데택배",
      tel: "+8215882121"
    }
  ];

  const handleTrack = () => {
    if (selectedCompany && trackingNumber) {
      const trackingUrl = `https://tracker.delivery/#/${selectedCompany}/${trackingNumber}`;
      window.open(trackingUrl, '_blank');
    } else {
      alert("배송사 또는 운송장 번호를 입력해주세요!")
    }
  };

  return (
    <div className="mypage-block">
      <Sidebar />
      <Paper sx={{ padding: 2, margin: 'auto', marginLeft: '500px' }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          배송 조회
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="배송사 선택"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              fullWidth
            >
              {deliveryCompanies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="운송장 번호"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} textAlign="right">
            <Button variant="contained" onClick={handleTrack}>
              조회하기
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default DeliveryTracking;