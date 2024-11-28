/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../Layouts/Navbar/Navbar";
import AlertSave from "../../../Alert/AlertSave";

// icons
import { FaCamera } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";

import './Profile.css';

function Profile({ username, name_surname, setToken, setRole, setUsername, setName_surname }) {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(name_surname);
  const [alertSave, setAlertSave] = useState(false);

  // รีเซ็ตข้อมูลทั้งหมดเมื่อล็อกเอาต์
  const handleLogout = () => {
    setToken("");
    setRole("");
    setUsername("");
    setName_surname("");

    ["authToken", "userRole", "username", "nameSurname"].forEach(item => localStorage.removeItem(item));
    navigate("/");
  };
  // ฟังก์ชันอัปเดตรูปโปรไฟล์
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      <div style={{ maxHeight: "726px" }}>
        <h1 className="profile-title">PROFILE</h1>
        <div className="profile-main">
          <div className="profile-img">
            <img
              src={profileImage || "./img/user.jpg"}
              alt="Profile"
              className="profile-image"
            />
            <label htmlFor="file-upload" className="profile-image-icon">
              <FaCamera />
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="profile-image-input"
              id="file-upload" // เพิ่ม id ให้กับ input
            />
          </div>

          <div className="profile-name">
            {name_surname}&nbsp;
            <CiEdit
              className="edit-name-icon"
              onClick={() => { setIsEditingName(true); }} />
          </div>
          <div className="profile-username">username : {username}</div>
          <div className="profile-logout">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {isEditingName && (
            <div className="edit-name-modal">
              <div className="edit-name-container">
                <label className="edit-name-title">แก้ไขชื่อ</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="edit-name-input"
                />
                <div className="edit-name-buttons">
                  <button
                    className="cancel-button-user"
                    onClick={() => {
                      setIsEditingName(false);
                    }}>
                    ยกเลิก
                  </button>
                  <button
                    className="save-button-user"
                    onClick={() => {
                    setName_surname(newName);
                    setAlertSave(true);
                    setTimeout(() => {
                      setAlertSave(false);
                      setIsEditingName(false);
                    },1500);
                    }}>
                    บันทึก
                  </button>
                </div>
              </div>
              {alertSave && (
                <div>
                  <AlertSave />
                </div>
              )}
            </div>
          )}


        </div>
      </div>
      <Navbar className="profile-navbar" />
    </div>
  );
}

export default Profile;
