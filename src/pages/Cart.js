import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Button,
  Container,
} from "@mui/material";


const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const payload = JSON.parse(localStorage.getItem('payload'));
  const userId = payload ? payload.user_id : '';
  const [isCheckedAll, setIsCheckedAll] = useState(false);


  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem(`cartItems_${userId}`)) || [];
    setCartItems(storedCartItems);
  }, [userId]);

  const handleIncrease = (productId) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === productId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    localStorage.setItem(`cartItems_${userId}`, JSON.stringify(updatedCartItems));
  };

  const handleDecrese = (productId) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === productId && item.quantity > 0) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    localStorage.setItem(`cartItems_${userId}`, JSON.stringify(updatedCartItems));
  };

  const handleDelete = () => {
    // 배열에서 체크되지 않은 항목들 filter해서 업데이트된 CartItems 로컬에 저장 
    const updatedCartItems = cartItems.filter((item) => !item.checked);
    setCartItems(updatedCartItems);
    localStorage.setItem(`cartItems_${userId}`, JSON.stringify(updatedCartItems));
  };

  const handleToggleCheck = (productId) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === productId) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  const handleToggleCheckAll = () => {
    const updatedCartItems = cartItems.map((item) => ({
      ...item,
      checked: !isCheckedAll
    }));
    setCartItems(updatedCartItems);
    setIsCheckedAll(!isCheckedAll);
  };

  const handlePlaceOrder = () => {
    const checkedItems = cartItems.filter((item) => item.checked);
    localStorage.setItem(`cartItems_${userId}_order`, JSON.stringify(checkedItems));

    if (checkedItems.length === 0) {
      alert("상품을 선택해주세요!")
      window.location.reload();
    }
  };

  return (
    <div>
      <h1 style={{ margin: "50px auto" }}>장바구니</h1>
      {cartItems.length > 0 ? (
        <Container>
          <TableContainer>
            <Table bordered={true}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>상품</TableCell>
                  <TableCell>가격</TableCell>
                  <TableCell>수량</TableCell>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={isCheckedAll}
                      onChange={handleToggleCheckAll}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>
                      <div className="productListItem">
                        {product.images.length > 0 && (
                          <img
                            className="productListImg"
                            src={product.images[0].image_file}
                            alt=""
                          />
                        )}
                        {product.product_name}
                      </div>
                    </TableCell>
                    <TableCell>{product.product_price}</TableCell>
                    <TableCell>
                      <div className="quantityControl">
                        {product.quantity}
                        <button style={{ marginLeft: "10px", width: "20px" }} onClick={() => handleDecrese(product.id)}>-</button>
                        <button style={{ marginLeft: "10px", width: "20px" }} onClick={() => handleIncrease(product.id)}>+</button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={product.checked}
                        onChange={() => handleToggleCheck(product.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ marginTop: "30px", float: "right" }}>
            <Button variant="contained" color="primary" sx={{ color: "white", marginRight: "20px" }} onClick={handleDelete}>
              삭제하기
            </Button>
            <Link to={`/order/productlist`}>
              <Button variant="contained" color="primary" sx={{ color: "white" }} onClick={handlePlaceOrder}>
                주문하기
              </Button>
            </Link>
          </div>
        </Container>
      ) : (
        <h2 style={{ marginTop: "200px" }}>장바구니에 상품이 없습니다.</h2>
      )}
    </div>
  );
};

export { Cart };