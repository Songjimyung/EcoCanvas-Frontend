import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function ColorToggleButton() {
  const [alignment, setAlignment] = React.useState("web");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
      sx={{
        height: "30px",
        marginBottom: "20px",
      }}
    >
      <ToggleButton value="web">등록순</ToggleButton>
      <ToggleButton value="android">최신순</ToggleButton>
    </ToggleButtonGroup>
  );
}
