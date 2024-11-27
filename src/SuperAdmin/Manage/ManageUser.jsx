/* eslint-disable react/prop-types */
// ManageUserModal.jsx
import { useState } from "react";

const ManageUser = ({ handleCloseModal, handleManageUserSubmit }) => {
  const [name_surname, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = () => {
    handleManageUserSubmit({ name_surname, username, password, role, token });
    handleCloseModal();
  };
  const handleDelete = () => {
    const userData = JSON.parse(localStorage.getItem("userData")) || [];

    // ค้นหา index ของผู้ใช้ที่ต้องการลบ
    const index = userData.findIndex(
      (user) =>
        user.name_surname === name_surname &&
        user.username === username &&
        user.password === password &&
        user.role === role &&
        user.token === token
    );

    if (index !== -1) {
      // ลบผู้ใช้ออกจากอาร์เรย์
      userData.splice(index, 1);
      localStorage.setItem("userData", JSON.stringify(userData)); // บันทึกข้อมูลใหม่กลับไป
      alert("ลบข้อมูลสำเร็จ!");
    } else {
      alert("ข้อมูลไม่ตรงกัน ไม่สามารถลบได้!");
    }

    handleCloseModal(); // ปิด Modal หลังจากดำเนินการเสร็จ
  };

  return (
    <div className="modal-overlay">
      <div className="modal-popup">
        <button className="close-button" onClick={handleCloseModal}>
          &times;
        </button>
        <h2>จัดการผู้ใช้งาน</h2>
        <label>ชื่อ-นามสกุล :</label>
        <input
          type="text"
          placeholder="Full Name"
          value={name_surname}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label>Username :</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password :</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>ตำแหน่ง :</label>
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <label>Token :</label>
        <input
          type="text"
          placeholder="Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        <button className="cancel-button" onClick={handleDelete}>
          ลบ
        </button>
        <button className="confirm-button" onClick={handleSubmit}>
          ยืนยัน
        </button>
      </div>
    </div>
  );
};

export default ManageUser;
