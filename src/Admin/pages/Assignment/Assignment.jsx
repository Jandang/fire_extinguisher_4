/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import fireExtinguisher from "../../../Data/fireExtinguisher";
import users from "../../../Data/users";

import { MdAssignmentAdd } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import "./Assignment.css";

function Assignment({ searchValue }) {
  const [fireInfo, setFireInfo] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isAssignment, setIsAssignment] = useState(false);
  const [inputValue, setInputValue] = useState(""); // เก็บค่าที่พิมพ์ใน input
  const [isValid, setIsValid] = useState(false); // ตรวจสอบว่า role เป็น "user"
  const [selectedRow, setSelectedRow] = useState(null); // เก็บข้อมูลแถวที่เลือก

  // เพิ่ม state สำหรับการแบ่งหน้า
  const [currentPage, setCurrentPage] = useState(1); // หน้าเริ่มต้นคือหน้า 1
  const itemsPerPage = 8; // จำนวนรายการต่อหน้า

  // คำนวณข้อมูลที่แสดงในแต่ละหน้า
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage); // คำนวณจำนวนหน้า

  // ดึงข้อมูลเริ่มต้นจาก Local Storage (เฉพาะรายการที่มอบหมาย)
  useEffect(() => {
    const savedAssignedData = JSON.parse(localStorage.getItem("fireExtinguisher")) || [];

    // ใช้ Map เพื่อจัดลำดับความสำคัญโดยยึด Local Storage
    const dataMap = new Map();

    // ใส่ข้อมูลจากไฟล์ fireExtinguisher ลงใน Map ก่อน
    fireExtinguisher.forEach((item) => {
      dataMap.set(item.serialNumber, item);
    });

    // แทนที่ข้อมูลใน Map ด้วยข้อมูลจาก Local Storage
    savedAssignedData.forEach((item) => {
      dataMap.set(item.serialNumber, item);
    });

    // แปลง Map กลับเป็น Array และกรองเฉพาะ status "Assigned" หรือ "Assign"
    const mergedData = Array.from(dataMap.values()).filter(
      (item) => item.status === "Assigned" || item.status === "Assign"
    );

    // ตั้งค่า state
    setFireInfo(mergedData);
    setFilteredData(mergedData); // ตั้งค่าเริ่มต้นเป็นข้อมูลที่ผ่านการกรอง
  }, []);

  useEffect(() => {
    if (searchValue.trim() === "") {
      setFilteredData(fireInfo);
    } else {
      const filtered = fireInfo.filter((item) => {
        return (
          item.serialNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.site.toLowerCase().includes(searchValue.toLowerCase())
        );
      });
      setFilteredData(filtered);
    }
    setCurrentPage(1); // รีเซ็ตหน้าเป็นหน้าแรกหลังจากการกรอง
  }, [searchValue, fireInfo]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // ตรวจสอบว่ามี username ที่ตรงกับ input และ role เป็น "user"
    const userMatch = users.find(
      (user) => user.username === value && user.role === "user"
    );
    setIsValid(!!userMatch); // ตั้งค่า isValid เป็น true หากตรงเงื่อนไข
  };

  const handleAssign = () => {
    if (isValid && selectedRow) {
      const updatedFireInfo = fireInfo.map((item) =>
        item.serialNumber === selectedRow.serialNumber
          ? { ...item, status: "Assigned", assignedTo: inputValue }
          : item
      );
  
      // ดึงข้อมูลจาก Local Storage แล้วอัปเดตเฉพาะรายการที่เปลี่ยนแปลง
      const localData = JSON.parse(localStorage.getItem("fireExtinguisher")) || [];
      const updatedLocalData = localData.map((item) =>
        item.serialNumber === selectedRow.serialNumber
          ? { ...item, status: "Assigned", assignedTo: inputValue }
          : item
      );
  
      // ตรวจสอบว่ามีข้อมูลใหม่ที่ยังไม่มีใน Local Storage หรือไม่
      const newItems = updatedFireInfo.filter(
        (item) => !updatedLocalData.some((localItem) => localItem.serialNumber === item.serialNumber)
      );
  
      // รวมข้อมูลใหม่เข้ากับข้อมูลที่มีอยู่
      const mergedData = [...updatedLocalData, ...newItems];
  
      // บันทึกข้อมูลกลับไปยัง Local Storage
      localStorage.setItem("fireExtinguisher", JSON.stringify(mergedData));
  
      setFireInfo(updatedFireInfo);
      setFilteredData(updatedFireInfo.filter((item) => item.status === "Assigned" || item.status === "Assign"));
      setIsAssignment(false); // ปิด modal
      setInputValue(""); // ล้าง input
      setIsValid(false); // รีเซ็ต isValid
    }
  };
  

  return (
    <div>
      <div className="assignment-table">
        <table>
          <thead>
            <tr>
              <th>Assignment</th>
              <th>Site</th>
              <th>S/N</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((fireExtinguisher) => (
              <tr key={fireExtinguisher.serialNumber}>
                <td>
                  <span
                    className="assignment-button"
                    onClick={() => {
                      setIsAssignment(true);
                      setSelectedRow(fireExtinguisher); // บันทึกแถวที่เลือก
                    }}
                  >
                    <MdAssignmentAdd />
                  </span>
                </td>
                <td>{fireExtinguisher.site}</td>
                <td>{fireExtinguisher.serialNumber}</td>
                <td>{fireExtinguisher.exp}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {isAssignment && (
          <div className="assignment-container">
            <span className="assignment-container-header">
              <h3>มอบหมายงาน</h3>
              <RxCross2
                onClick={() => setIsAssignment(false)}
                style={{ cursor: "pointer", fontSize: "30px", color: "#000" }}
              />
            </span>
            <span className="assignment-container-input">
              <input
                type="text"
                className="assignment-input"
                placeholder="Username . . ."
                value={inputValue}
                onChange={handleInputChange}
              />
              <button
                className="assignment-button-confirm"
                disabled={!isValid}
                onClick={handleAssign}
              >
                ยืนยัน
              </button>
            </span>
          </div>
        )}
      </div>
      {/* Pagination Controls */}
      <div className="paginationAdmin">
        <button className="paginationAdminButton" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
          &lt;&lt;
        </button>
        <button className="paginationAdminButton" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          &lt;
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button className="paginationAdminButton" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          &gt;
        </button>
        <button className="paginationAdminButton" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
          &gt;&gt;
        </button>
      </div>
    </div>
  );
}

export default Assignment;
