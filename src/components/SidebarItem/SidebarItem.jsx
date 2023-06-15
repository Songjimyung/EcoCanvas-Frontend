import React from "react";
import './sidebarItem.css'

function SidebarItem({ menu, isActive }) {
  return isActive === true ? (
    <div className="sidebar-item-active">
      <p className="menu-name">{menu.name}</p>
    </div >
  ) : (
    <div className="sidebar-item">
      <p>{menu.name}</p>
    </div>
  );
}

export default SidebarItem;