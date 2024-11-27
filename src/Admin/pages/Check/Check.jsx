/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Check.css';

function Check({ searchValue }) {
  const [fireInfo, setFireInfo] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน
  const itemsPerPage = 8; // จำนวนรายการต่อหน้า

  useEffect(() => {
    // ดึงข้อมูลทั้งหมดจาก localStorage
    const data = JSON.parse(localStorage.getItem('fireExtinguisher')) || [];
    const confirmedData = data.filter(item => item.status === "Complete"); // กรองเฉพาะ "Confirmed"
    setFireInfo(confirmedData); // ตั้งค่า fireInfo ด้วยข้อมูลที่กรองแล้ว
    setFilteredData(confirmedData); // ตั้งค่าเริ่มต้น
  }, []);
  
  useEffect(() => {
    if (searchValue.trim() === '') {
      // กรองเฉพาะ status "Confirmed"
      setFilteredData(fireInfo.filter(item => item.status === "Complete"));
    } else {
      const filtered = fireInfo.filter((item) => {
        return (
          (item.serialNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.site.toLowerCase().includes(searchValue.toLowerCase())) &&
          item.status === "Complete" // เพิ่มเงื่อนไข status "Confirmed"
        );
      });
      setFilteredData(filtered);
    }
    setCurrentPage(1); // รีเซ็ตหน้าไปหน้าแรกเมื่อมีการค้นหา
  }, [searchValue, fireInfo]);
  

  // คำนวณข้อมูลที่จะแสดงในหน้าปัจจุบัน
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // ฟังก์ชันสำหรับเปลี่ยนหน้า
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="assignment-table">
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>S/N</th>
              <th>Site</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((fireExtinguisher) => (
              <tr key={fireExtinguisher.serialNumber}>
                <td>{fireExtinguisher.fromUser}</td>
                <td>
                  <Link className="serial" to={`/serialNumber/${fireExtinguisher.serialNumber}`}>
                    {fireExtinguisher.serialNumber}
                  </Link>
                </td>
                <td>{fireExtinguisher.site}</td>
                <td>{fireExtinguisher.lastDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ส่วนควบคุมการแบ่งหน้า */}
      <div className="paginationAdmin">
        <button className="paginationAdminButton" onClick={() => goToPage(1)} disabled={currentPage === 1}>
          &lt;&lt; {/* ไปหน้าแรก */}
        </button>
        <button className="paginationAdminButton" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          &lt; {/* ย้อนกลับ */}
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button className="paginationAdminButton" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          &gt; {/* หน้าต่อไป */}
        </button>
        <button className="paginationAdminButton" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
          &gt;&gt; {/* ไปหน้าสุดท้าย */}
        </button>
      </div>
    </div>
  );
}

export default Check;
