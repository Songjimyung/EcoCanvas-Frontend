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
      <div className="headerTitle">{h1Text}</div>
      <p style={{ fontWeight: "300", marginTop: "10px", fontSize: "1.2rem" }}>
        {pText}
      </p>
    </div>
  );
}

export default ImageHeader;
