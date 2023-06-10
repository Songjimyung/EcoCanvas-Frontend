import Topbar from "./conponents/topbar/Topbar"
import Sidebar from "./conponents/sidebar/Sidebar"
import './app.css'
import Home from './pages/home/Home'
import UserList from "./pages/userList/UserList"
import User from "./pages/user/User"
import CreateUser from "./pages/createUser/CreateUser"
import ProductList from "./pages/productList/ProductList"
import Product from "./pages/product/Product"
import CreateProduct from "./pages/createProduct/CreateProduct"

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Topbar />
      <div className="container">
        <Sidebar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:userId" element={<User />} />
          <Route path="/createUser" element={<CreateUser />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:productId" element={<Product />} />
          <Route path="/createProduct" element={<CreateProduct />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
