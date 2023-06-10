import Topbar from './components/topbar/Topbar'
import Sidebar from './components/sidebar/Sidebar';
import AdminSidebar from './admin_conponents/Adminsidebar/AdminSidebar';
import AdminTopbar from './admin_conponents/Admintopbar/AdminTopbar';
import './css/App.css'
import { Home } from './pages/Home';
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Campaign } from "./pages/Campaign";
import { Shop } from "./pages/Shop";
import { ShopDetail } from "./pages/ShopDetail";
import { AdminHome } from "./admin_pages/admin_home/admin_Home";
import { Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from 'react';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const payload = localStorage.getItem('payload');
    console.log(payload)
    if (payload) {
      const payloadObject = JSON.parse(payload);
      setIsAdmin(payloadObject.is_admin);
    }
  }, []);

  return (
    <div>
      {!isAdmin && <div className=""></div>}
      {/* {!isAdmin ? <Topbar /> : <AdminTopbar />} */}
      <AdminTopbar />
      {!isAdmin && <div className="container"></div>}
      {/* {!isAdmin ? <Sidebar /> : <AdminSidebar />} */}
      <AdminSidebar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/campaign" element={<Campaign />}></Route>
        <Route path="/shop" element={<Shop />}></Route>
        <Route path="/product" element={<ShopDetail />}></Route>
        <Route path="/admin_home" element={<AdminHome />}></Route>
      </Routes>
    </div >
  );
}

export default App;
