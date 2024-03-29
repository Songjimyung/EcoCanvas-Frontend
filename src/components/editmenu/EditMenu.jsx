import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ITEM_HEIGHT = 48;

export default function EditMenu({ options, onOptionClick }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (optionId) => {
    onOptionClick(optionId);
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="edit-menu-button"
        aria-controls={open ? "edit-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="edit-menu"
        MenuListProps={{
          "aria-labelledby": "edit-menu-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.id}
            onClick={() => handleMenuItemClick(option.id)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
