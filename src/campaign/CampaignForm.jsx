import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/campaign.css";

// mui
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// Checkbox
const label = { inputProps: { "aria-label": "Funding Checkbox" } };

const CampaignForm = ({ initialData, isUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignContent, setCampaignContent] = useState("");
  const [campaignMembers, setCampaignMembers] = useState("");
  const [campaignCategory, setCampaignCategory] = useState("");
  const [campaignTags, setCampaignTags] = useState("");
  const [campaignImage, setCampaignImage] = useState("");
  const [campaignStartDate, setCampaignStartDate] = useState("");
  const [campaignEndDate, setCampaignEndDate] = useState("");
  const [activityStartDate, setActivityStartDate] = useState(null);
  const [activityEndDate, setActivityEndDate] = useState(null);
  const [isFundChecked, setIsFundChecked] = useState(false);
  const [campaignFundGoal, setCampaignFundGoal] = useState(0);
  const [campaignApproveFile, setCampaignApproveFile] = useState("");

  const [selectedImageName, setSelectedImageName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const token = localStorage.getItem("access");
  useEffect(() => {
    if (isUpdate && initialData) {
      setCampaignTitle(initialData.title);
      setCampaignContent(initialData.content);
      setCampaignMembers(initialData.members);
      setCampaignStartDate(initialData.campaign_start_date + "T00:00:00");
      setCampaignEndDate(initialData.campaign_end_date + "T00:00:00");
      setIsFundChecked(initialData.is_funding);
      setCampaignFundGoal(initialData.goal);
    }
  }, [isUpdate, initialData]);

  const handleCampaignTitle = (event) => {
    setCampaignTitle(event.target.value);
  };

  const handleCampaignContent = (event) => {
    setCampaignContent(event.target.value);
  };
  const handleCampaignCategory = (event) => {
    setCampaignCategory(event.target.value);
  };
  const handleCampaignTags = (event) => {
    const tags = event.target.value.split(",").map((tag) => tag.trim());
    setCampaignTags(tags);
  };

  const handleCampaignMembers = (event) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^0-9.-]+/g, ""));
    setCampaignMembers(numericValue);
  };

  const handleCampaignStartDate = (date) => {
    setCampaignStartDate(date.toISOString());
  };
  const handleCampaignEndDate = (date) => {
    setCampaignEndDate(date.toISOString());
  };
  const handleActivityStartDate = (date) => {
    setActivityStartDate(date.toISOString());
  };
  const handleActivityEndDate = (date) => {
    setActivityEndDate(date.toISOString());
  };

  const handleFundCheck = (event) => {
    setIsFundChecked(event.target.checked);
  };

  const handleCampaignFundGoal = (event) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^0-9.-]+/g, ""));
    setCampaignFundGoal(numericValue);
  };

  const handleImageUpload = (event) => {
    const image = event.target.files[0];
    setSelectedImageName(image.name);
    setCampaignImage(event.target.files[0]);
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFileName(file.name);
    setCampaignApproveFile(event.target.files[0]);
  };

  const axiosCampaignCreate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", campaignTitle);
    formData.append("content", campaignContent);
    formData.append("members", campaignMembers);
    formData.append("category", campaignCategory);
    if (campaignTags.length > 0) {
      campaignTags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });
    } else {
      formData.append("tags[0]", "태그없음");
    }

    formData.append("image", campaignImage);
    formData.append("campaign_start_date", campaignStartDate);
    formData.append("campaign_end_date", campaignEndDate);
    if (activityStartDate !== null) {
      formData.append("activity_start_date", activityStartDate);
    }
    if (activityEndDate !== null) {
      formData.append("activity_end_date", activityEndDate);
    }
    formData.append("status", 0);
    formData.append("is_funding", isFundChecked);

    if (isFundChecked && campaignFundGoal !== 0) {
      formData.append("goal", campaignFundGoal);
      formData.append("current", 0);
      formData.append("approve_file", campaignApproveFile);
    }

    if (!isUpdate) {
      try {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/campaigns/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("캠페인이 신청되었습니다. 관리자의 승인을 기다려주세요.");
        navigate("/campaign");
      } catch (e) {
        alert("캠페인 신청에 실패했습니다.");
        console.error(e);
      }
    } else {
      try {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/campaigns/${id}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("캠페인이 수정되었습니다.");
        navigate(`/campaign/${id}`);
      } catch (e) {
        console.error(e);
        alert("캠페인 수정에 실패했습니다.");
      }
    }
  };

  return (
    <div className="campaignCreateForm">
      <div className="campaignCreateBody">
        <div className="marginBottom10">
          <div className="campaignCreateTitle">
            캠페인 제목<span className="campaignCreateStar">*</span>
          </div>
          <TextField
            id="outlined-multiline-flexible"
            label="제목"
            maxRows={4}
            sx={{
              width: "100%",
            }}
            value={campaignTitle}
            onChange={handleCampaignTitle}
          />
        </div>

        <div className="marginBottom10">
          <div className="campaignCreateTitle">
            캠페인 내용<span className="campaignCreateStar">*</span>
          </div>
          <TextField
            id="outlined-multiline-static"
            label="내용"
            multiline
            rows={4}
            sx={{
              width: "100%",
            }}
            value={campaignContent}
            onChange={handleCampaignContent}
          />
        </div>

        <div className="marginBottom30">
          <div className="campaignCreateTitle">
            캠페인 참가정원<span className="campaignCreateStar">*</span>
          </div>
          <TextField
            id="outlined-number"
            label="참가 정원"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              width: "100%",
            }}
            inputProps={{ min: 0 }}
            value={campaignMembers}
            onChange={handleCampaignMembers}
          />
        </div>

        <div className="marginBottom30">
          <div className="campaignCreateTitle">
            캠페인 유형<span className="campaignCreateStar">*</span>
          </div>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">유형</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={campaignCategory}
              label="유형"
              onChange={handleCampaignCategory}
            >
              <MenuItem value={0}>봉사</MenuItem>
              <MenuItem value={1}>교육</MenuItem>
              <MenuItem value={2}>투자</MenuItem>
              <MenuItem value={3}>이벤트</MenuItem>
              <MenuItem value={4}>환경운동</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="marginBottom10">
          <div className="campaignCreateTitle">캠페인 태그</div>
          <TextField
            id="outlined-multiline-static"
            label="태그"
            multiline
            rows={2}
            sx={{
              width: "100%",
            }}
            value={campaignTags}
            onChange={handleCampaignTags}
          />
        </div>
        <div className="campaignExplain" style={{ marginBottom: "10px" }}>
          ※태그는 쉼표(,)로 구분해서 작성해주세요.
        </div>

        <div className="marginBottom30">
          <div className="campaignCreateTitle">
            캠페인 첨부 이미지<span className="campaignCreateStar">*</span>
          </div>
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
              style={{ display: "none" }}
              id="image-upload"
              type="file"
              accept="image/jpg,impge/png,image/jpeg,image/gif"
              onChange={handleImageUpload}
            />
            <Button
              variant="outlined"
              color="gray"
              component="div"
              sx={{ marginLeft: "10px" }}
            >
              파일 선택
            </Button>
          </label>
        </div>

        <div className="campaignDate">
          <div>
            <div className="campaignCreateTitle">
              캠페인 시작일<span className="campaignCreateStar">*</span>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateField", "DatePicker"]}>
                <DatePicker
                  disablePast
                  value={campaignStartDate}
                  onChange={handleCampaignStartDate}
                  label="날짜를 선택해주세요."
                  format="YYYY-MM-DD"
                  sx={{
                    marginRight: "30px",
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>

          <div>
            <div className="campaignCreateTitle">
              캠페인 마감일<span className="campaignCreateStar">*</span>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateField", "DatePicker"]}>
                <DatePicker
                  disablePast
                  value={campaignEndDate}
                  onChange={handleCampaignEndDate}
                  label="날짜를 선택해주세요."
                  format="YYYY-MM-DD"
                  sx={{
                    width: "100%",
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>

        <div className="campaignDate">
          <div>
            <div className="campaignCreateTitle">활동 시작일</div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateField", "DatePicker"]}>
                <DatePicker
                  disablePast
                  value={activityStartDate}
                  onChange={handleActivityStartDate}
                  label="날짜를 선택해주세요."
                  format="YYYY-MM-DD"
                  sx={{
                    marginRight: "30px",
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>

          <div>
            <div className="campaignCreateTitle">활동 마감일</div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateField", "DatePicker"]}>
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
        <div className="campaignExplain">※활동이 없는 캠페인은 비워주세요.</div>

        <div className="campaignFundCheck">
          <Checkbox
            {...label}
            checked={isFundChecked}
            value={isFundChecked}
            onChange={handleFundCheck}
          />
          <span>펀딩 여부</span>
        </div>

        <div className="marginBottom30">
          <div className="campaignCreateTitle">펀딩 목표 금액</div>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel htmlFor="outlined-adornment-amount">금액</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={
                <InputAdornment position="start">￦</InputAdornment>
              }
              label="금액"
              disabled={!isFundChecked}
              inputProps={{ min: 0 }}
              value={
                campaignFundGoal !== undefined
                  ? campaignFundGoal.toLocaleString()
                  : ""
              }
              onChange={handleCampaignFundGoal}
            />
          </FormControl>
        </div>

        <div className="marginBottom10">
          <div className="campaignCreateTitle">펀딩 첨부 파일</div>
          <TextField
            label="첨부 파일"
            size="small"
            variant="standard"
            readOnly={true}
            disabled
            sx={{ width: "70%" }}
            value={selectedFileName}
          />
          <label htmlFor="file-upload">
            <input
              style={{ display: "none" }}
              id="file-upload"
              type="file"
              disabled={!isFundChecked}
              onChange={handleFileUpload}
            />
            <Button
              variant="outlined"
              color="gray"
              component="div"
              disabled={!isFundChecked}
              sx={{ marginLeft: "10px" }}
            >
              파일 선택
            </Button>
          </label>
          <div className="campaignExplain">
            ※캠페인 주최와 관련된 자격 증빙이나, 캠페인 계획서를 제출해주세요.
          </div>
        </div>

        <Button
          variant="contained"
          color="primary"
          sx={{
            fontSize: "1rem",
            color: "white",
            marginTop: "10px",
            marginBottom: "30px",
          }}
          onClick={axiosCampaignCreate}
        >
          제출하기
        </Button>
      </div>
    </div>
  );
};

export default CampaignForm;
