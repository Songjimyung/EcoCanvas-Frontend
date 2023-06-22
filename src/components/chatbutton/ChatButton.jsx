import React from "react";
import { useState } from "react";
import Modal from "../modal/Modal";
import ChatDetail from "../../admin_pages/chatDetail/ChatDetail";
import Fab from "@mui/material/Fab";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import "./chatbutton.css";

export default function ChatButton() {
  // Chat modal
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const openChatModal = () => {
    setChatModalOpen(true);
  };
  const closeChatModal = () => {
    setChatModalOpen(false);
  };

  return (
    <div className="chat-button">
      <Fab
        color="primary"
        sx={{ mr: 1, color: "white" }}
        onClick={openChatModal}
      >
        <SupportAgentIcon fontSize="large" />
      </Fab>
      <Modal open={chatModalOpen} close={closeChatModal} header="상담">
        <ChatDetail />
      </Modal>
    </div>
  );
}
