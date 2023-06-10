import React, { useState } from "react";
import './createUser.css';

export default function CreateUser() {
    const [formData, setUserFormData] = useState({
        email: "",
        username: "",
        password: "",
        adress: "",
        active: "",
    });
    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(formData)
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserFormData({ ...formData, [name]: value });
    };
    return (
        <div className="createUser">
            <h1 className="createUserTitle">유저 생성</h1>
            <form className="createUserForm" onSubmit={handleFormSubmit}>
                <div className="createUserItem">
                    <label>Email</label>
                    <input type="text" name="email" placeholder="이메일" onChange={handleInputChange}></input>
                </div>
                <div className="createUserItem">
                    <label>이름</label>
                    <input type="text" name="username" placeholder="이름" onChange={handleInputChange}></input>
                </div>
                <div className="createUserItem">
                    <label>비밀번호</label>
                    <input type="text" name="password" placeholder="비밀번호" onChange={handleInputChange}></input>
                </div>
                <div className="createUserItem">
                    <label>주소</label>
                    <input type="text" name="adress" placeholder="주소" onChange={handleInputChange}></input>
                </div>
                <div className="createUserItem">
                    <label>활성화 상태</label>
                    <select className="createUserSelect" name="active" id="active" onChange={handleInputChange}>
                        <option value={"True"}>활성화</option>
                        <option value={"False"}>비 활성화</option>
                    </select>
                </div>
                <button className="createUserButton">생성하기</button>
            </form>
        </div>
    )
}