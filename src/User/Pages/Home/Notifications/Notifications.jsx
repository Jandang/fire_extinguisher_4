/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import './Notifications.css';

function Notifications({ fireInfo, username }) {
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        if (Array.isArray(fireInfo)) {
            // ดึงข้อมูลจาก localStorage
            const storedData = JSON.parse(localStorage.getItem('fireExtinguisher')) || [];

            // รวมข้อมูล fireInfo และ storedData
            const combinedData = fireInfo.map((fire) => {
                const matchedReport = storedData.find((stored) => stored.serialNumber === fire.serialNumber);
                return matchedReport ? matchedReport : fire;
            });

            // กรองข้อมูลที่มี to ตรงกับ username และสถานะเป็น "Assign"
            const result = combinedData.filter((fire) => fire.to === username && fire.status === "Assign" || fire.status === "Assigned");
            setFiltered(result);
        }
    }, [fireInfo, username]);

    // ถ้าไม่มีข้อมูลให้แสดงข้อความ
    if (filtered.length === 0) {
        return (
            <div className="notifications-container">

                <div className="fire-header">
                    <Link to="/home">
                        <span className="bi bi-arrow-left back-icon"></span>
                    </Link>
                    <span className="fire-title">NOTIFICATIONS</span>
                </div>

                <div className="no-notification">
                    ไม่มีการแจ้งเตือน
                </div>
            </div>
        );
    }

    return (
        <div className="notifications-container">

            <div className="fire-header">
                <Link to="/home">
                    <span className="bi bi-arrow-left back-icon"></span>
                </Link>
                <span className="fire-title">NOTIFICATIONS</span>
            </div>

            <div className="fire-card-container">
                {filtered.map((fire) => (
                    <Link to={`/fire-details/${fire.serialNumber}`} key={fire.serialNumber} className="fire-card-link">
                        <Card
                            className="fire-card shadow-sm"
                            style={{
                                height: "max-content",
                                width: "100%",
                            }}
                        >
                            <Card.Body className="fire-card-body">
                                <Card.Title
                                    style={{ fontSize: "16px" }}>
                                    S/N : {fire.serialNumber}
                                </Card.Title>
                                <Card.Text
                                    style={{ fontSize: "14px" }}>
                                    สถานที่ : {fire.site} <br />
                                    รายงาน : -
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                ))}
            </div>

        </div>
    );
}

export default Notifications;
