import * as React from "react";
import "./imageheader.css";

function ImageHeader({ h1Text, pText, imageUrl }) {
  const headerStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    height: "350px",
    color: "white",
    textAlign: "center",
    paddingTop: "120px",
    backgroundColor: "#0005",
    backgroundBlendMode: "darken",
  };

  return (
    <div className="header-bg" style={headerStyle}>
      <h1>{h1Text}</h1>
      <p style={{ fontWeight: "300", marginTop: "10px" }}>{pText}</p>
    </div>
  );
}

export default ImageHeader;
