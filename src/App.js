import React, { useState, useEffect } from 'react';
import Topbar from './components/topbar/Topbar'
import Sidebar from './components/sidebar/Sidebar';
import AdminSidebar from './admin_conponents/Adminsidebar/AdminSidebar';
import AdminTopbar from './admin_conponents/Admintopbar/AdminTopbar';
import './css/App.css'
import { Home } from './pages/Home';
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Campaign } from "./pages/Campaign";
import { CampaignDetail } from "./pages/CampaignDetail";
import { CampaignCreate } from "./pages/CampaignCreate";
import { Shop } from "./pages/Shop";
import { ShopDetail } from "./pages/ShopDetail";
import { Mypage } from "./pages/Mypage";
import { AdminHome } from "./admin_pages/admin_home/admin_Home";
import { Routes, Route } from "react-router-dom";
import UserList from "./admin_pages/userList/UserList"
import User from "./admin_pages/user/User"
import CreateUser from "./admin_pages/createUser/CreateUser"
import ProductList from "./admin_pages/productList/ProductList"
import Product from "./admin_pages/product/Product"
import CreateProduct from "./admin_pages/createProduct/CreateProduct"
import { CallbackKakao } from './pages/kakaocallback';

import { createTheme, ThemeProvider } from "@mui/material";

// MUI로 만든 컴포넌트 폰트지정
const theme = createTheme({
  typography: {
    fontFamily: "'Nanum Gothic', sans-serif"
  }
})

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const payload = localStorage.getItem('payload');
    if (payload) {
      const payloadObject = JSON.parse(payload);
      console.log(payloadObject.is_admin);
      setIsAdmin(payloadObject.is_admin);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div>
        {!isAdmin ? <Topbar /> : <AdminTopbar />}
        {/* <AdminTopbar /> */}
        <div className={!isAdmin ? "" : 'adminContainer'}>
          {!isAdmin ? <Sidebar /> : <AdminSidebar />}
          {/* <AdminSidebar /> */}
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/campaign" element={<Campaign />}></Route>
            <Route path="/campaign/:id" element={<CampaignDetail />} />
            <Route path="/campaign/create" element={<CampaignCreate />} />
            <Route path="/shop" element={<Shop />}></Route>
            <Route path="/product" element={<ShopDetail />}></Route>
            <Route path="/mypage" element={<Mypage />}></Route>
            <Route path="/admin_home" element={<AdminHome />}></Route>
            <Route path="/admin_users" element={<UserList />} />
            <Route path="/admin_users/:userId" element={<User />} />
            <Route path="/admin_createUser" element={<CreateUser />} />
            <Route path="/admin_products" element={<ProductList />} />
            <Route path="/admin_products/:productId" element={<Product />} />
            <Route path="/admin_createProduct" element={<CreateProduct />} />
            <Route path="/users/oauth/kakao/callback" element={<CallbackKakao />} />
          </Routes>
        </div>
      </div >
    </ThemeProvider>
  );
}

export default App;
