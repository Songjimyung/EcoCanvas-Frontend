import { useState } from "react";
import axios from 'axios';

function Toggle({ content }) {
  const [isCheck, setCheck] = useState(false);
  const [category_name, setCategory_Name] = useState("");

  const CategoryData = {
    category_name,
  };
  const handleSubmit = () => {
    const token = localStorage.getItem('access');
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/shop/categorys/list/`, CategoryData, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })

      .then((response) => {
        
        alert("카테고리 등록 완료!")
        window.location.reload();
      })
      .catch((error) => {
        
      });
  };

  return (
    <>
      <div>
        <button onClick={() => { setCheck((e) => !e); }} style={{ width: '25px' }}> {isCheck ? "-" : "+"}
        </button>
        <span style={{ fontSize: "35px", marginLeft: "5px", color: "grey" }}>카테고리 등록</span>
      </div>
      {isCheck && (
        <>
          <input
            name="category_name"
            type="text"
            value={category_name}
            placeholder="카테고리 이름"
            onChange={(e) => setCategory_Name(e.target.value)} />
          <button onClick={handleSubmit}>Submit</button>
        </>
      )}
    </>
  );
}

export default Toggle;