import React, { useState, useEffect } from 'react';
import Topbar from './components/topbar/Topbar'
import Footer from './components/footer/Footer';
import AdminSidebar from './admin_conponents/Adminsidebar/AdminSidebar';
import AdminTopbar from './admin_conponents/Admintopbar/AdminTopbar';
import './css/App.css'
import { Home } from './pages/Home';
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { ResetPasswordEmail } from "./pages/ResetPasswordEmail";
import { ReadPasswordEmail } from "./pages/ReadPasswordEmail";
import { ResetPassword } from "./pages/ResetPassword";
import { UpdatePassword } from "./pages/UpdatePassword";
import { Campaign } from "./pages/Campaign";
import { CampaignDetail } from "./pages/CampaignDetail";
import { CampaignCreate } from "./pages/CampaignCreate";
import { KakaoInit } from "./campaign/Kakaohooks";
import { Shop } from "./pages/Shop";
import { ShopDetail } from "./pages/ShopDetail";
import { Mypage } from "./pages/Mypage";
import BuyProduct from './pages/BuyProduct';
import { AdminHome } from "./admin_pages/admin_home/admin_Home";
import { Routes, Route, useLocation } from "react-router-dom";
import UserList from "./admin_pages/userList/UserList"
import User from "./admin_pages/user/User"
import { AdminOrderList } from "./admin_pages/orderList/OrderList"
import CreateUser from "./admin_pages/createUser/CreateUser"
import ProductList from "./admin_pages/productList/ProductList"
import Product from "./admin_pages/product/Product"
import CreateProduct from "./admin_pages/createProduct/CreateProduct"
import { KakaoRedirect } from './pages/kakaoredirect';
import { CallbackGoogle } from './pages/GoogleCallback';
import { MyPostCampaign } from './pages/mypagelist/myCampaign'
import { MyLikes } from './pages/mypagelist/myLikes'
import DeliveryTracking from './pages/mypagelist/myDelivery';
import { MyOrder } from './pages/mypagelist/myOrder';
import { MyRefundreceipt } from './pages/mypagelist/myRefundreceipt';
import { MyReviewComment } from './pages/mypagelist/myReviewcomment';
import { createTheme, ThemeProvider } from "@mui/material";
import { ApplyListCampaign } from './admin_pages/ApplycampaignList/ApplyCampaignList'
import { MyProfile } from './pages/mypagelist/myprofile'
import { ProductDetail } from './admin_pages/productdetail/Productdetail'
import { ChatList } from './admin_pages/chatList/ChatList';
import { ChatDetail } from './admin_pages/chatDetail/ChatDetail';
import { RegisterPayment } from './pages/mypagelist/myPayment';
import { ReceiptList} from './pages/mypagelist/mySchedule';
import ChatButton from './components/chatbutton/ChatButton';

import NotificationHistory from './components/NotificationHistory/NotificationHistory'
// MUI로 만든 컴포넌트 폰트지정, 컬러지정
const theme = createTheme({
  typography: {
    fontFamily: "'Pretendard-Regular'"
  },
  palette: {
    primary: {
      main: '#3eac3e',
    },
    secondary: {
      main: '#11cb5f',
    },
    danger: {
      main: '#e53e3e',
    },
    black: {
      main: '#000000',
    },
    gray: {
      main: '#808080',
    },
  },
})

// App 시작
function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const isMypage = location.pathname.startsWith('/mypage');

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
      <div id='wrapper'>
        <KakaoInit />
        <ChatButton />
        {!isAdmin ? <Topbar /> : <AdminTopbar />}
        {/* <AdminTopbar /> */}
        <div className={!isAdmin ? "" : 'adminContainer'}>
          {!isAdmin ? null : (isMypage ? null : <AdminSidebar />)}
          {/* <AdminSidebar /> */}
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/reset_pw/email_code" element={<ResetPasswordEmail />}></Route>
            <Route path="/reset_pw/reset_params" element={<ReadPasswordEmail />}></Route>
            <Route path="/reset_pw" element={<ResetPassword />}></Route>
            <Route path="/update_pw" element={<UpdatePassword />}></Route>
            <Route path="/campaign" element={<Campaign />}></Route>
            <Route path="/campaign/:id" element={<CampaignDetail />} />
            <Route path="/campaign/create" element={<CampaignCreate />} />
            <Route path="/shop" element={<Shop />}></Route>
            <Route path="/product/:productId" element={<ShopDetail />}></Route>
            <Route path="/product/buy/:productId" element={<BuyProduct />}></Route>
            <Route path="/mypage" element={<Mypage />}></Route>
            <Route path="/mypage/profile" element={<MyProfile />}></Route>
            <Route path="/mypage/mypostcampaign" element={<MyPostCampaign />}></Route>
            <Route path="/mypage/mylikes" element={<MyLikes />}></Route>
            <Route path="/mypage/myorders" element={<MyOrder />}></Route>
            <Route path="/mypage/mydelivery" element={<DeliveryTracking />}></Route>
            <Route path="/mypage/myrefund" element={<MyRefundreceipt />}></Route>
            <Route path="/mypage/myreviews" element={<MyReviewComment />}></Route>
            <Route path="/admin_home" element={<AdminHome />}></Route>
            <Route path="/admin_orderlist" element={<AdminOrderList />}></Route>
            <Route path="/admin_users" element={<UserList />} />
            <Route path="/admin_campaign" element={<ApplyListCampaign />} />
            <Route path="/admin_users/:userId" element={<User />} />
            <Route path="/admin_createUser" element={<CreateUser />} />
            <Route path="/admin_products" element={<ProductList />} />
            <Route path="/admin_product/detail/:productId" element={<ProductDetail />} />
            <Route path="/admin_products/:productId" element={<Product />} />
            <Route path="/admin_createProduct" element={<CreateProduct />} />
            <Route path="/users/oauth/kakao/callback/" element={<KakaoRedirect />} />
            <Route path="/users/google/callback" element={<CallbackGoogle />} />
            <Route path="/chats" element={<ChatList />} />
            <Route path="/mypage/mypayments" element={<RegisterPayment />}></Route>
            <Route path="/mypage/myschedule" element={<ReceiptList />}></Route>
            <Route path="/chat" element={<ChatDetail />} />
            <Route path="/notification" element={<NotificationHistory />} />
          </Routes>
        </div>

      </div >
      <Footer />
    </ThemeProvider>
  );
}

export default App;
