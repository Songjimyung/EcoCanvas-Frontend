import { useState } from "react";
import axios from 'axios';

function Toggle({ content }) {
  const [isCheck, setCheck] = useState(false);
  const [category_name, setCategory_Name] = useState("");
  const [category_number, setCategory_Number] = useState("");

  const CategoryData = {
    category_name,
    category_number
  };
  const handleSubmit = () => {
    axios.post("http://127.0.0.1:8000/shop/category/", CategoryData)
      .then((response) => {
        console.log(response)
        alert("카테고리 등록 완료!")
        window.location.reload();
      })
      .catch((error) => {
        console.log(error)
      });
  };

  return (
    <>
      <div>
        <button onClick={() => { setCheck((e) => !e); }}> {isCheck ? "-" : "+"}
        </button>
        <span style={{ fontSize: "20px", marginLeft: "5px", color: "grey" }}>카테고리 등록</span>
      </div>
      {isCheck && (
        <>
          <input
            name="category_name"
            type="text"
            value={category_name}
            placeholder="카테고리 이름"
            onChange={(e) => setCategory_Name(e.target.value)} />
          <input
            name="category_number"
            type="number"
            value={category_number}
            placeholder="카테고리 번호"
            onChange={(e) => setCategory_Number(e.target.value)} />
          <button onClick={handleSubmit}>Submit</button>
        </>
      )}
    </>
  );
}

export default Toggle;