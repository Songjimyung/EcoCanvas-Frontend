import { useState, useEffect } from "react";
import axios from 'axios';
import { Modal, Button, Input } from "antd";

function CategoryUpdateDeleteModal() {
  const [updatedCategoryName, setUpdatedCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  const handleCategorySelect = (event) => {
    const selectedCategoryId = event.target.value;
    setSelectedCategoryId(selectedCategoryId);

    const category = categoryList.find(category => category.id === selectedCategoryId);
    if (category) {
      setUpdatedCategoryName(category.category_name);
    }
  };

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/shop/categorys/list/`);
      setCategoryList(response.data);
    } catch (error) {
      alert(error)
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const handleCategoryUpdate = () => {
    if (!updatedCategoryName) {
      alert("수정할 카테고리 이름을 입력하세요.");
      return;
    }
    const token = localStorage.getItem('access');
    const updatedCategoryData = {
      category_name: updatedCategoryName,
    };
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shop/categorys/list/${selectedCategoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedCategoryData),
    })
      .then(async (response) => {
        if (response.status === 200) {
          alert("카테고리 수정 완료!");
          handleCloseModal();
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

  const handleCategoryDelete = () => {
    const token = localStorage.getItem('access');
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shop/categorys/list/${selectedCategoryId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (response.status === 204) {
          alert("카테고리 삭제 완료!");
          handleCloseModal();
          window.location.reload();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message);
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
      <Button onClick={handleOpenModal}>카테고리 Edit</Button>
      {isModalVisible && (
        <Modal
          title="카테고리 수정/삭제"
          visible={true}
          onCancel={handleCloseModal}
          footer={[
            <Button key="cancel" onClick={handleCloseModal}>
              취소
            </Button>,
            <Button key="update" type="primary" onClick={handleCategoryUpdate}>
              수정
            </Button>,
            <Button key="delete" type="primary" danger onClick={handleCategoryDelete}>
              삭제
            </Button>
          ]}
        >
          <select className="category-dropdown" onChange={handleCategorySelect}>
            <option value="">카테고리 선택</option>
            {categoryList.map(category => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
          <Input
            name="updated_category_name"
            type="text"
            value={updatedCategoryName}
            placeholder="수정할 카테고리 이름"
            onChange={(e) => setUpdatedCategoryName(e.target.value)}
          />
        </Modal>
      )}
    </>
  );
}

export default CategoryUpdateDeleteModal;
