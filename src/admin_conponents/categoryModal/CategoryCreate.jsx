import { useState, useEffect } from "react";
import axios from 'axios';
import { Modal, Button, Input } from "antd";

function CategoryModal({ content }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [category_name, setCategory_Name] = useState("");


  const CategoryData = {
    category_name,
  };

  const fetchCategoryList = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/shop/categorys/list/`);
    } catch (error) {
      alert(error)
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const handleSubmit = () => {
    const token = localStorage.getItem('access');
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shop/categorys/list/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(CategoryData),
    })
      .then(async (response) => {
        if (response.status === 201) {
          await response.json();
          alert("저장 완료!");
          window.location.reload();
        } else {
          const data = await response.json();
          const errorValues = Object.values(data);
          throw new Error(errorValues.join('\n'));
        }
      })
      .catch((error) => {
        alert(error);
      });
  };



  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };


  return (
    <>
      <Button onClick={handleOpenModal} >카테고리 등록</Button>
      <Modal
        title="카테고리"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            취소
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit} >
            등록
          </Button>
        ]}
      >
        <Input
          name="category_name"
          type="text"
          value={category_name}
          placeholder="카테고리 이름"
          onChange={(e) => setCategory_Name(e.target.value)}
        />
      </Modal>
    </>
  );
}

export default CategoryModal;