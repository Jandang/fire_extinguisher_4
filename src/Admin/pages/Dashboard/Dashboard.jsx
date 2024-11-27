/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import fireExtinguisher from "../../../Data/fireExtinguisher";
import "./Dashboard.css";

function Dashboard({ searchValue }) {
  const [fireInfo, setFireInfo] = useState([]); // ข้อมูลถังดับเพลิงทั้งหมด
  const [filteredData, setFilteredData] = useState([]); // ข้อมูลที่กรองตามสถานะหรือการค้นหา
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบันสำหรับ pagination
  const itemsPerPage = 10; // จำนวนรายการต่อหน้า
  const [selectedRow, setSelectedRow] = useState(null); // เก็บข้อมูลแถวที่ถูกเลือก
  const [isAssignment, setIsAssignment] = useState(false);

  // ฟังก์ชันดึงข้อมูลจาก localStorage
  const getLocalStorageData = () =>
    JSON.parse(localStorage.getItem("fireExtinguisher")) || [];

  // รวมข้อมูลจากไฟล์และ localStorage (ลำดับความสำคัญ: localStorage > ไฟล์)
  const mergedData = () => {
    const localData = getLocalStorageData();
    const map = new Map();

    [...fireExtinguisher, ...localData].forEach((item) => {
      map.set(item.serialNumber, item); // ใช้ serialNumber เป็น key
    });

    return Array.from(map.values());
  };

  // ดึงข้อมูลครั้งแรกและตั้งค่า fireInfo และ filteredData
  useEffect(() => {
    const data = mergedData();
    setFireInfo(data);
    setFilteredData(data.filter((fire) => fire.status === "Report")); // กรองเฉพาะสถานะ "Report"
  }, []);

  // กรองข้อมูลเมื่อมีการค้นหา
  useEffect(() => {
    const filtered =
      searchValue.trim() === ""
        ? fireInfo.filter((fire) => fire.status === "Report") // ถ้าไม่มีข้อความค้นหา ให้แสดงข้อมูลสถานะ "Report"
        : fireInfo.filter((item) =>
          (item.serialNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.site.toLowerCase().includes(searchValue.toLowerCase())) &&
          item.status === "Report"
        );

    setFilteredData(filtered);
    setCurrentPage(1); // รีเซ็ตไปหน้าแรก
  }, [searchValue, fireInfo]);

  // คำนวณรายการในหน้าปัจจุบัน
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // คำนวณจำนวนหน้าทั้งหมด (ขั้นต่ำ 1 หน้า)
  const totalPages = Math.max(Math.ceil(filteredData.length / itemsPerPage), 1);

  // ฟังก์ชันเปลี่ยนหน้า
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ฟังก์ชันจัดการคลิกที่แถว
  const handleRowClick = (row) => {
    setSelectedRow(row); // เก็บข้อมูลของแถวที่ถูกเลือก
  };

  // ฟังก์ชันเพื่อเปลี่ยนสถานะเป็น "Assigned" และบันทึกเฉพาะแถวที่เลือก
  // ฟังก์ชันเพื่อเปลี่ยนสถานะเป็น "Assigned" และบันทึกเฉพาะแถวที่เลือก
  // ฟังก์ชันเปลี่ยนสถานะเป็น "Assigned" พร้อมบันทึกใน localStorage
const handleToAssign = () => {
  if (!selectedRow) return; // ถ้ายังไม่มีแถวที่เลือก ให้ไม่ทำอะไร

  const updatedFireInfo = fireInfo.map((item) =>
    item.serialNumber === selectedRow.serialNumber
      ? { ...item, status: "Assigned" } // อัปเดตสถานะเป็น "Assigned"
      : item
  );

  // ดึงข้อมูลจาก localStorage และรวมข้อมูลใหม่กับข้อมูลเก่า
  const localData = getLocalStorageData();
  const updatedLocalData = localData.map((item) =>
    item.serialNumber === selectedRow.serialNumber
      ? { ...item, status: "Assigned" }
      : item
  );

  const isExistingInLocal = localData.some(
    (item) => item.serialNumber === selectedRow.serialNumber
  );

  // ถ้ารายการนี้ยังไม่มีใน localStorage ให้เพิ่มเข้าไป
  if (!isExistingInLocal) {
    updatedLocalData.push({
      ...selectedRow,
      status: "Assigned",
    });
  }

  localStorage.setItem("fireExtinguisher", JSON.stringify(updatedLocalData));

  // อัพเดตข้อมูลใน state
  setFireInfo(updatedFireInfo);
  setFilteredData(updatedFireInfo.filter((item) => item.status === "Report"));
  setIsAssignment(false); // ปิดหน้ารายละเอียด
};

// ฟังก์ชันเปลี่ยนสถานะเป็น "Confirmed" พร้อมบันทึกใน localStorage
const handleToConfirm = () => {
  if (!selectedRow) return; // ถ้ายังไม่มีแถวที่เลือก ให้ไม่ทำอะไร

  const updatedRow = {
    ...selectedRow,
    status: "Confirmed",
  };

  const updatedFireInfo = fireInfo.map((item) =>
    item.serialNumber === selectedRow.serialNumber ? updatedRow : item
  );

  // ดึงข้อมูลจาก localStorage และรวมข้อมูลใหม่กับข้อมูลเก่า
  const localData = getLocalStorageData();
  const updatedLocalData = localData.map((item) =>
    item.serialNumber === selectedRow.serialNumber
      ? updatedRow
      : item
  );

  const isExistingInLocal = localData.some(
    (item) => item.serialNumber === selectedRow.serialNumber
  );

  // ถ้ารายการนี้ยังไม่มีใน localStorage ให้เพิ่มเข้าไป
  if (!isExistingInLocal) {
    updatedLocalData.push(updatedRow);
  }

  localStorage.setItem("fireExtinguisher", JSON.stringify(updatedLocalData));

  // อัพเดตข้อมูลใน state
  setFireInfo(updatedFireInfo);
  setFilteredData(updatedFireInfo.filter((item) => item.status === "Report"));
  setIsAssignment(false); // ปิดหน้ารายละเอียด
};


  return (
    <div>
      {/* ตารางข้อมูล */}
      <div className="assignment-table">
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>S/N</th>
              <th>Status</th>
              <th>Site</th>
              {/* <th>Date</th> */}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((fireExtinguisher) => (
              <tr
                key={fireExtinguisher.serialNumber}
                onClick={() => {handleRowClick(fireExtinguisher), setIsAssignment(true)}} // เพิ่มฟังก์ชันคลิก
                className={selectedRow?.serialNumber === fireExtinguisher.serialNumber ? "selected-row" : ""}
              >
                <td>{fireExtinguisher.reporter || "Anonymous"}</td>
                <td>{fireExtinguisher.serialNumber}</td>
                <td>{fireExtinguisher.status}</td>
                <td>{fireExtinguisher.site}</td>
                {/* <td>{fireExtinguisher.exp}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* แสดงรายละเอียดการรายงาน */}
      {isAssignment && (
        <div className="reportDetailsContainer">
          <div className="reportDetails">
            <div className="reportDetailsHeader">
              <label
                style={{
                  fontWeight: "500",
                  fontSize: "18px",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                รายละเอียดการรายงานปัญหา
              </label>
              <button
                style={{ backgroundColor: "transparent", border: "none", cursor: "pointer", color: 'white' }}
                onClick={() => setIsAssignment(false)} // ปิดหน้ารายละเอียด
              >
                X
              </button>
            </div>
            <div className="reportDetailsBody">
              <label>ชื่อผู้รายงาน : {selectedRow.reporter}</label> <br />
              <label>หมายเลขถัง : {selectedRow.serialNumber}</label> <br />
              <label>สถานที่ : {selectedRow.site}</label> <br />
              <label>รายละเอียด : {selectedRow.reportDetails || "ไม่มีข้อมูล"}</label>
            </div>
            <div className="reportDetailsFooter">
              <button onClick={handleToConfirm}>ไม่ตรวจสอบ</button>
              <button onClick={handleToAssign}>ตรวจสอบ</button>
            </div>
          </div>
        </div>
      )}

      {/* การแบ่งหน้า */}
      <div className="paginationAdmin">
        <button
          className="paginationAdminButton"
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
        >
          &lt;&lt; {/* ไปหน้าแรก */}
        </button>
        <button
          className="paginationAdminButton"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt; {/* ย้อนกลับ */}
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="paginationAdminButton"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt; {/* หน้าต่อไป */}
        </button>
        <button
          className="paginationAdminButton"
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          &gt;&gt; {/* ไปหน้าสุดท้าย */}
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
