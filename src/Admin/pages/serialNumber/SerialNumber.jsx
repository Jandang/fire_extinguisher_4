/* eslint-disable react-hooks/rules-of-hooks */
import './serialNumber.css';
import { useParams } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";

function serialNumber() {
    const { serialNumber } = useParams();

    // ฟังก์ชันดึงข้อมูลจาก localStorage
    function getDataFire() {
        const fireData = JSON.parse(localStorage.getItem('fireExtinguisher')) || []; // ดึงข้อมูลจาก localStorage
        return fireData.find((fireExtinguisher) => fireExtinguisher.serialNumber === serialNumber); // หา S/N ที่ตรงกัน
    }

    const fireData = getDataFire();

    const conditionLabels = {
        group1: 'สภาพของถังดับเพลิง',
        group2: 'ความดันของถังดับเพลิง',
        group3: 'หัวฉีดและวาล์ว',
        group4: 'สลักนิรภัยและซีลป้องกัน',
        group5: 'ตำแหน่งการติดตั้ง',
    }
    const updateStatusToAssigned = () => {
        const fireDataList = JSON.parse(localStorage.getItem('fireExtinguisher')) || [];
        const updatedData = fireDataList.map(item => {
            if (item.serialNumber === serialNumber) {
                return { ...item, status: "Assigned" }; // อัปเดตสถานะเป็น "มอบหมาย"
            }
            return item;
        });

        localStorage.setItem('fireExtinguisher', JSON.stringify(updatedData)); // บันทึกข้อมูลกลับไปยัง localStorage
        alert('สถานะได้เปลี่ยนเป็น "มอบหมาย"');
        window.history.back(); // ย้อนกลับไปหน้าก่อนหน้า
    };

    const updateStatusToConfirmed = () => {
        const fireDataList = JSON.parse(localStorage.getItem('fireExtinguisher')) || [];
        const updatedData = fireDataList.map(item => {
            if (item.serialNumber === serialNumber) {
                return { ...item, status: "Confirmed" }; // อัปเดตสถานะเป็น "Complete"
            }
            return item;
        });

        localStorage.setItem('fireExtinguisher', JSON.stringify(updatedData)); // บันทึกข้อมูลกลับไปยัง localStorage
        alert('สถานะได้เปลี่ยนเป็น "Confirmed"');
        window.history.back(); // ย้อนกลับไปหน้าก่อนหน้า
    }

    return (
        <div className="containerSerial">
            <div className='snHeader'>
                <label className='ttHeader'>รายละเอียดการตรวจสอบ</label>
                <RxCross2
                    className='closeSerial'
                    onClick={() => window.history.back()} />
            </div>
            <div className='report-details-container'>
                {fireData ? (
                    <div className="reportInfo">
                        <div>
                            <strong>S/N:</strong> {serialNumber} <br />
                            <strong>สถานที่:</strong> {fireData.site} <br />
                            <strong>สถานะ:</strong> {fireData.status} <br />
                            <strong>ผู้บันทึก:</strong> {fireData.fromUser} <br />
                            <strong>วันที่บันทึก:</strong> {fireData.lastDate} <br />
                            <strong>หมายเหตุ:</strong> {fireData.note || "-"} <br />
                        </div>
                        <div>
                            {fireData.reportImages && fireData.reportImages.length > 0 ? (
                                fireData.reportImages.map((image, index) => (
                                    <img
                                        key={index}
                                        className="fire-extinguisher-img"
                                        src={image} // แสดงภาพแต่ละภาพ
                                        alt={`ถังดับเพลิง ${index + 1}`}
                                    />
                                ))
                            ) : (
                                <span>ไม่มีภาพ</span>
                            )}
                        </div>
                    </div>
                ) : (
                    <span>ไม่พบข้อมูลสำหรับ S/N : {serialNumber}</span>
                )}
                <div className="reportChecklist">
                    {fireData && fireData.conditions ? (
                        <div className="checklist">
                            {Object.entries(fireData.conditions).map(([key, value]) => (
                                <div className="item" key={key}>
                                    <label style={{ fontWeight: 'bold', fontSize: '18px' }}>{conditionLabels[key]}:</label>
                                    <input type="checkbox" checked={value === "pass"} disabled /> ผ่าน
                                    <input type="checkbox" checked={value !== "pass"} disabled /> ไม่ผ่าน
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>ไม่มีข้อมูลสถานะการตรวจสอบ</div>
                    )}
                </div>
            </div>
            <div className='reportButton'>
                <button
                    onClick={updateStatusToAssigned}
                    className='buttonFailed'
                >
                    ไม่ผ่าน
                </button>
                <button
                    className='buttonPass'
                    onClick={updateStatusToConfirmed}
                >
                    ผ่าน
                </button>
            </div>
        </div>
    );
}

export default serialNumber;
