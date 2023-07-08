import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function ColorToggleButton({ onChange, value }) {
  const handleChange = (event, newAlignment) => {
    onChange(newAlignment);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={value}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
      sx={{
        height: "30px",
        marginBottom: "20px",
      }}
    >
      <ToggleButton value="recent">최신순</ToggleButton>
      <ToggleButton value="oldest">등록순</ToggleButton>
    </ToggleButtonGroup>
  );
}
