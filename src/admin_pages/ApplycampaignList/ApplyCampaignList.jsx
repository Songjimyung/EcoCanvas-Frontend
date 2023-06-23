import React, { useEffect, useState } from "react";
import "./applycampaignList.css";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import axios from "axios";

export default function ApplyListCampaign() {
  const [ApplyData, setApplyData] = useState([]);
  const [selectedApply, setSelectedApply] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access");
      try {
        let url = `${process.env.REACT_APP_BACKEND_URL}/campaigns/admin/campaign_list/`;
        url += `?page=${currentPage}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const campaigns = response.data.results.map((campaign, index) => {
          const approveFile =
            campaign.fundings && campaign.fundings.approve_file
              ? campaign.fundings.approve_file
              : "";
          const goal =
            campaign.fundings && campaign.fundings.goal
              ? campaign.fundings.goal
              : "";

          
          
          

          return {
            id: campaign.id,
            title: campaign.title,
            activity_end_date: campaign.activity_end_date,
            activity_start_date: campaign.activity_start_date,
            campaign_end_date: campaign.campaign_end_date,
            campaign_start_date: campaign.campaign_start_date,
            content: campaign.content,
            members: campaign.members,
            is_funding: campaign.is_funding,
            user: campaign.user,
            status: campaign.status,
            image: campaign.image,
            approve_file: approveFile,
            goal: goal,
          };
        });
        setApplyData(campaigns);
        const totalPages = Math.ceil(response.data.count / 10);
        setTotalPages(totalPages);
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, [currentPage]);

  const handleAction = (action) => {
    const token = localStorage.getItem("access");
    let updatedCampaign = { ...selectedApply };

    if (action === "approve") {
      updatedCampaign = { ...updatedCampaign, status: "1" };
    } else if (action === "return") {
      updatedCampaign = { ...updatedCampaign, status: "0" };
    }
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/campaigns/status/${selectedApply.id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCampaign),
      }
    )
      .then(() => {
        alert(
          `캠페인 상태변경(${
            action === "approve" ? "승인" : "반려"
          })이 완료되었습니다.`
        );
        setSelectedApply(null);
        setOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        
      });
  };

  const handlePageChange = async (event, page) => {
    setCurrentPage(page);
  };

  const handleOpen = (campaignId) => {
    const selectedCampaign = ApplyData.find(
      (campaign) => campaign.id === campaignId
    );
    setSelectedApply(selectedCampaign);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedApply(null);
    setOpen(false);
  };

  const getUrl = (filePath) => {
    if (process.env.NODE_ENV === "development") {
      return `${process.env.REACT_APP_BACKEND_URL}${filePath}`;
    }
    return `${filePath}`;
  };

  return (
    <div className="mypage-block">
      <div className="campaign-table-container">
        <h1>캠페인 신청 내역</h1>
        <table>
          <thead>
            <tr>
              <th>신청 번호</th>
              <th>캠페인 제목</th>
              <th>펀딩 여부</th>
              <th>승인현황</th>
              <th>작성자</th>
              <th>세부 정보</th>
            </tr>
          </thead>
          <tbody>
            {ApplyData.length > 0 ? (
              ApplyData.map((campaign) => (
                <tr key={campaign.id}>
                  <td>{campaign.id}</td>
                  <td>{campaign.title}</td>
                  <td>{campaign.is_funding ? "Yes" : "No"}</td>
                  <td
                    style={{
                      color:
                        campaign.status === "미승인"
                          ? "red"
                          : campaign.status === "캠페인 모집중"
                          ? "blue"
                          : "black",
                    }}
                  >
                    {campaign.status}
                  </td>{" "}
                  <td>{campaign.user}</td>
                  <td>
                    <button
                      className="details-button"
                      onClick={() => handleOpen(campaign.id)}
                    >
                      세부 정보 보기
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <h2>캠페인 신청 내역이 없습니다.</h2>
            )}
          </tbody>
        </table>
        <Grid container justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            color="primary"
            onChange={handlePageChange}
          />
        </Grid>
      </div>
      <Dialog open={open} onClose={handleClose} style={{ textAlign: "center" }}>
        <DialogTitle>캠페인 세부 정보</DialogTitle>
        <DialogContent>
          {selectedApply && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  캠페인 ID: {selectedApply.id}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  제목: {selectedApply.title}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  캠페인 신청일: {selectedApply.campaign_start_date}~
                  {selectedApply.campaign_end_date}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  활동 예정일: {selectedApply.activity_start_date}~
                  {selectedApply.activity_end_date}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  내용: {selectedApply.content}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">이미지:</Typography>
                {selectedApply.image ? (
                  <img
                    src={getUrl(selectedApply.image)}
                    alt="캠페인 이미지"
                    height="250"
                  />
                ) : (
                  <Typography variant="body1">No image</Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1">승인 파일:</Typography>
                {selectedApply.approve_file ? (
                  <a
                    href={getUrl(selectedApply.approve_file)}
                    download={encodeURIComponent(selectedApply.approve_file)}
                  >
                    파일열기
                  </a>
                ) : (
                  <Typography variant="body1">No File</Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  신청인원: {selectedApply.members}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  style={{ color: selectedApply.is_funding ? "green" : "red" }}
                >
                  펀딩 여부: {selectedApply.is_funding ? "Yes" : "No"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  펀딩 목표금액: {selectedApply.goal}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  작성자: {selectedApply.user}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  승인 현황: {selectedApply.status}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleAction("approve")}
            style={{ fontSize: "20px", color: "blue", margin: "auto" }}
          >
            승인
          </Button>
          <Button
            onClick={() => handleAction("return")}
            style={{ fontSize: "20px", color: "red", margin: "auto" }}
          >
            반려
          </Button>
          <Button
            onClick={handleClose}
            style={{ fontSize: "20px", margin: "auto" }}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export { ApplyListCampaign };
