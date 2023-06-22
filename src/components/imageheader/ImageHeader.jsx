import * as React from "react";
import "./imageheader.css";

function ImageHeader({ text }) {
  return (
    <div className="header-bg">
      <h1>{text}</h1>
      <p style={{ fontWeight: "300", marginTop: "10px" }}>
        EcoCanvas Campaigns
      </p>
    </div>
  );
}

export default ImageHeader;
