/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";

import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

import Navbar from "../../Layouts/Navbar/Navbar";
import Card from "react-bootstrap/Card";
import "./Home.css";

function Home({ fireInfo }) {
    // ตรวจสอบว่าข้อมูลมีอยู่หรือไม่หากไม่มีให้แสดงข้อความ
    if (!Array.isArray(fireInfo) || fireInfo.length === 0) {
        return <div>No data available</div>;
    }

    const storedFilterInfo = () => {
        const storedData = JSON.parse(localStorage.getItem('fireExtinguisher')) || [];

        const combinedData = fireInfo.map((fire) => {
            const matchedReport = storedData.find((stored) => stored.serialNumber === fire.serialNumber);
            return matchedReport ? matchedReport : fire;
        });

        return combinedData.filter((fire) => fire.status === "Assign");
    }

    const [filterInfo, setFilterInfo] = useState(storedFilterInfo());
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;

    // จัดการการแบ่งหน้า
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filterInfo.slice(indexOfFirstItem, indexOfLastItem);

    //คำนวณจํานวนหน้า
    const totalPages = Math.ceil(filterInfo.length / itemsPerPage);

    //การเปลี่ยนหน้า
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    // ฟังก์ชันค้นหา
    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchValue(value);

        // กรองข้อมูลตามคำค้นหา
        const filtered = fireInfo.filter((fire) =>
            fire.serialNumber.toLowerCase().includes(value.toLowerCase()) ||
            fire.site.toLowerCase().includes(value.toLowerCase())
        );

        // อัปเดต filterInfo
        setFilterInfo(filtered);
        setCurrentPage(1);
    };

    return (
        <div className="home-container">
            <div style={{ maxHeight: "726px", height: "726px", maxWidth: "375px", width: "335px" }}>

                <div className="home-header">
                    <div>
                        <img src="./img/logo1.svg" alt="" className="logo-container-user" />
                    </div>
                    <span>
                        <input
                            type="text"
                            className="search-bar"
                            placeholder="Search"
                            value={searchValue}
                            onChange={handleSearch}
                        />
                    </span>
                    <Link to="/notifications">
                        <span className="bi bi-bell-fill bell-icon"></span>
                    </Link>
                </div>

                <div className="home-body">
                    {currentItems.length > 0 ? (
                        currentItems.map((fire) => (
                            <Link to={`/fire-details/${fire.serialNumber}`} key={fire.serialNumber} className="fire-card-link">
                                <Card
                                    key={fire.serialNumber}
                                    className="fire-card shadow-sm"
                                    style={{
                                        height: "max-content",
                                        width: "100%",
                                    }}
                                >
                                    <Card.Body className="fire-card-body">
                                        <Card.Title style={{ fontSize: "16px" }}>
                                            S/N : {fire.serialNumber}
                                        </Card.Title>
                                        <Card.Text style={{ fontSize: "14px" }}>
                                            สถานที่ : {fire.site} <br />
                                            รายงาน : -
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Link>
                        ))
                    ) : (
                        <div className="no-data-message">
                            ไม่พบข้อมูล
                        </div>
                    )}
                    {filterInfo.length > itemsPerPage && (
                        <div className="pagination">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="pagination-button-user"
                            >
                                <IoIosArrowBack />
                            </button>
                            <span className="pagination-info">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="pagination-button-user"
                            >
                                <IoIosArrowForward />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Navbar className="home-navbar" />
        </div>
    );
}

export default Home;
