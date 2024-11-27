/* eslint-disable react/prop-types */
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { FaCamera } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

import './FireDetails.css';
import AlertWarning from '../../../../Alert/AlertWarning';
import AlertSave from '../../../../Alert/AlertSave';

function FireDetails({ fireInfo, setFireInfo, username }) {
    const { serialNumber } = useParams(); // ดึง serialNumber จาก URL
    const navigate = useNavigate();

    // ฟังก์ชันค้นหาข้อมูลของถังที่เลขตรงกัน
    function getFireData() {
        return fireInfo.find((fire) => fire.serialNumber === serialNumber);
    }
    const fireData = getFireData();

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("fireExtinguisher")) || [];
        const localFireData = storedData.find(fire => fire.serialNumber === serialNumber);

        if (localFireData) {
            setFireInfo(prevFireInfo => {
                const isExisting = prevFireInfo.some(fire => fire.serialNumber === serialNumber);
                if (isExisting) {
                    // อัปเดตข้อมูลที่มีอยู่ใน state
                    return prevFireInfo.map(fire =>
                        fire.serialNumber === serialNumber
                            ? { ...fire, ...localFireData }
                            : fire
                    );
                } else {
                    // เพิ่มข้อมูลใหม่เข้าไปใน state
                    return [...prevFireInfo, localFireData];
                }
            });
        }
    }, [serialNumber, setFireInfo]);

    // ตัวจับเวลา
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000); // อัปเดตทุกๆ วินาที

        return () => clearInterval(timer); // ล้างตัวจับเวลาเมื่อ component ถูก unmount
    }, []);

    const formattedDate = currentDateTime.toLocaleDateString("th-TH");
    const formattedTime = currentDateTime.toLocaleTimeString();

    //ฟังก์ชันสําหรับอัปโหลดรูปภาพ
    const [reportImage, setReportImage] = useState([]);

    const uploadImg = (e) => {
        const files = Array.from(e.target.files);

        const readers = files.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                // เมื่ออ่านไฟล์เสร็จ ให้ส่งค่าข้อมูลของภาพ (base64) กลับมา
                reader.onload = () => resolve(reader.result);
                // หากเกิดข้อผิดพลาดขณะอ่านไฟล์ ให้ส่ง error กลับ
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file); // อ่านไฟล์เป็น Base64
            });
        });

        Promise.all(readers)
            .then((images) => {
                // ใช้ setReportImages เพื่อเพิ่มภาพใหม่ใน state โดยรวมกับภาพเก่าที่มีอยู่แล้ว
                setReportImage((prevImages) => [...prevImages, ...images]);
            })
            .catch((err) => console.error("Error loading images:", err));
    }

    const removeImage = (index) => {
        setReportImage((prevImages) => prevImages.filter((_, i) => i !== index)); // ลบภาพตาม index
    };

    const [showPopup, setShowPopup] = useState(false);


    const [note, setNote] = useState(""); // State สำหรับเก็บหมายเหตุ

    const [conditions, setConditions] = useState({
        group1: "", // สภาพของถังดับเพลิง
        group2: "", // ความดัน
        group3: "", // หัวฉีดและวาล์ว
        group4: "", // สลักนิรภัย
        group5: ""  // ตำแหน่งการติดตั้ง
    });
    const handleConditionChange = (group, value) => {
        setConditions((prev) => ({
            ...prev,
            [group]: value
        }));
    };

    const [isalertNo, setIsalertNo] = useState(false);

    // ฟังก์ชันสําหรับบันทึกข้อมูลและอัปเดตสถานะ
    const handleSave = () => {
        const isAllChecked = Object.values(conditions).every((value) => value !== "");
        if (!isAllChecked || !note.trim()) {
            setIsalertNo(true);
            setTimeout(() => setIsalertNo(false), 5500);
            return;
        }

        const lastDate = `${formattedDate}`;

        const dataToSave = {
            serialNumber: serialNumber,
            mfd: fireData.mfd,
            exp: fireData.exp,
            site: fireData.site,
            brand: fireData.brand,
            fromUser: username,
            status: "Complete",
            reportImages: reportImage, // 
            conditions,
            note,
            lastDate
        };

        const updatedFireInfo = fireInfo.map(fire =>
            fire.serialNumber === serialNumber
                ? { ...fire, ...dataToSave } // ถ้ามีให้แทนที่ข้อมูลเดิม
                : fire // ถ้าไม่มีก็ให้เก็บข้อมูลเดิม
        );

        setFireInfo(updatedFireInfo);

        const isChecked = conditions.group1 && conditions.group2 && conditions.group3 && conditions.group4 && conditions.group5;

        if (isChecked) {
            // ถ้าได้ทำการตรวจสอบ ถังนี้ก็สามารถบันทึกลง localStorage ได้
            const existingData = JSON.parse(localStorage.getItem("fireExtinguisher")) || [];
            const updatedData = existingData.filter(fire => fire.serialNumber !== serialNumber); // ลบข้อมูลเก่าที่มี serialNumber ตรงกับถังนี้
            updatedData.push(dataToSave); // เพิ่มข้อมูลที่อัปเดตแล้ว
            localStorage.setItem("fireExtinguisher", JSON.stringify(updatedData)); // บันทึกลง localStorage
        }

        setShowPopup(true);
        setTimeout(() => {
            const updatedFireInfo = fireInfo.map(fire =>
                fire.serialNumber === serialNumber
                    ? { ...fire, status: "Complete", conditions, note, lastDate }
                    : fire
            );
            setFireInfo(updatedFireInfo);
            setShowPopup(false);
            navigate("/home");
        }, 1500);

    };

    return (
        <div className="firedetails-container">

            <div className="fire-header">
                <Link to="/home">
                    <span className="bi bi-arrow-left back-icon"></span>
                </Link>
                <span className="firedetails-title">{serialNumber}</span>
            </div>

            <div className="fire-body">

                <div>
                    <div className="firedetails-info">
                        <div className='firedetails-time'>
                            <div>{formattedDate}</div>
                            <div>{formattedTime}</div>
                        </div>
                        <div>
                            {fireData ? (
                                <span>
                                    S/N : {serialNumber} <br />
                                    สถานที่ : {fireData.site} <br />
                                    วันที่ผลิต : {fireData.mfd || "-"} <br />
                                    วันที่หมดอายุ : {fireData.exp || "-"} <br />
                                    แบรนด์ : {fireData.brand || "-"} <br />
                                </span>
                            ) : (
                                <span>ไม่พบข้อมูลสำหรับ S/N : {serialNumber}</span>
                            )}
                        </div>
                    </div>
                </div>
                {/* <div className="firedetails-report">
                    <span>รายงาน : </span>
                </div> */}
                <div className="firedetails-report-1">
                    <span>ปัญหาที่พบ : {fireData.reportDetails}</span>
                </div>

                {/* ---------------------------------------------------------------------------- */}

                <div className="firedetails-image-container">
                    {reportImage.map((image, index) => (
                        <div key={index} style={{ position: "relative", display: "inline-block" }}>
                            <img
                                src={image}
                                alt={`Uploaded ${index}`}
                                className="firedetails-image"
                            />
                            <button
                                onClick={() => removeImage(index)}
                                style={{
                                    position: "absolute",
                                    top: "-5px",
                                    right: "5px",
                                    background: "transparent",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    fontSize: "22px"
                                }}
                            >
                                <IoIosCloseCircle />
                            </button>
                        </div>
                    ))}
                    <label htmlFor="file-upload" className="file-label">
                        <FaCamera />
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        className="file-img-input"
                        onChange={uploadImg}
                        id="file-upload"
                    />
                </div>

                <div className='firedetails-check'>
                    {/*-----------------------------------------------------สภาพของถัง------------------------------------------------------------*/}
                    <span style={{ fontWeight: "500" }}>สภาพของถังดับเพลิง</span>
                    <Form className='firedetails-radio'>
                        {['radio'].map((type) => (
                            <div key={`inline-${type}`}>
                                <Form.Check
                                    inline
                                    label="ผ่าน"
                                    name="group1"
                                    type="radio"
                                    id="group1-pass"
                                    value="pass"
                                    checked={conditions.group1 === "pass"}
                                    onChange={() => handleConditionChange("group1", "pass")}
                                />
                                <Form.Check
                                    inline
                                    label="ไม่ผ่าน"
                                    name="group1"
                                    type="radio"
                                    id="group1-fail"
                                    value="fail"
                                    checked={conditions.group1 === "fail"}
                                    onChange={() => handleConditionChange("group1", "fail")}
                                />
                            </div>
                        ))}
                    </Form>
                    {/*-----------------------------------------------------ความดันของถังอยู่ในระดับที่เหมาะสม------------------------------------------------------------*/}
                    <span style={{ fontWeight: "500" }}>ความดันของถังดับเพลิง</span>
                    <Form className='firedetails-radio'>
                        {['radio'].map((type) => (
                            <div key={`inline-${type}`}>
                                <Form.Check
                                    inline
                                    label="ผ่าน"
                                    name="group2"
                                    type="radio"
                                    id="group2-pass"
                                    value="pass"
                                    checked={conditions.group2 === "pass"}
                                    onChange={() => handleConditionChange("group2", "pass")}
                                />
                                <Form.Check
                                    inline
                                    label="ไม่ผ่าน"
                                    name="group2"
                                    type="radio"
                                    id="group2-fail"
                                    value="fail"
                                    checked={conditions.group2 === "fail"}
                                    onChange={() => handleConditionChange("group2", "fail")}
                                />
                            </div>
                        ))}
                    </Form>
                    {/*-----------------------------------------------------หัวฉีดและวาล์วไม่อุดตัน------------------------------------------------------------*/}
                    <span style={{ fontWeight: "500" }}>หัวฉีดและวาล์ว</span>
                    <Form className='firedetails-radio'>
                        {['radio'].map((type) => (
                            <div key={`inline-${type}`}>
                                <Form.Check
                                    inline
                                    label="ผ่าน"
                                    name="group3"
                                    type="radio"
                                    id="group3-pass"
                                    value="pass"
                                    checked={conditions.group3 === "pass"}
                                    onChange={() => handleConditionChange("group3", "pass")}
                                />
                                <Form.Check
                                    inline
                                    label="ไม่ผ่าน"
                                    name="group3"
                                    type="radio"
                                    id="group3-fail"
                                    value="fail"
                                    checked={conditions.group3 === "fail"}
                                    onChange={() => handleConditionChange("group3", "fail")}
                                />
                            </div>
                        ))}
                    </Form>
                    {/*-----------------------------------------------------สลักนิรภัยและซีลป้องกันไม่ถูกดึงออก------------------------------------------------------------*/}
                    <span style={{ fontWeight: "500" }}>สลักนิรภัยและซีลป้องกัน</span>
                    <Form className='firedetails-radio'>
                        {['radio'].map((type) => (
                            <div key={`inline-${type}`}>
                                <Form.Check
                                    inline
                                    label="ผ่าน"
                                    name="group4"
                                    type="radio"
                                    id="group4-pass"
                                    value="pass"
                                    checked={conditions.group4 === "pass"}
                                    onChange={() => handleConditionChange("group4", "pass")}
                                />
                                <Form.Check
                                    inline
                                    label="ไม่ผ่าน"
                                    name="group4"
                                    type="radio"
                                    id="group4-fail"
                                    value="fail"
                                    checked={conditions.group4 === "fail"}
                                    onChange={() => handleConditionChange("group4", "fail")}
                                />
                            </div>
                        ))}
                    </Form>
                    {/*-----------------------------------------------------ตำแหน่งการติดตั้งเหมาะสม------------------------------------------------------------*/}
                    <span style={{ fontWeight: "500" }}>ตำแหน่งการติดตั้ง</span>
                    <Form className='firedetails-radio'>
                        {['radio'].map((type) => (
                            <div key={`inline-${type}`}>
                                <Form.Check
                                    inline
                                    label="ผ่าน"
                                    name="group5"
                                    type="radio"
                                    id="group5-pass"
                                    value="pass"
                                    checked={conditions.group5 === "pass"}
                                    onChange={() => handleConditionChange("group5", "pass")}
                                />
                                <Form.Check
                                    inline
                                    label="ไม่ผ่าน"
                                    name="group5"
                                    type="radio"
                                    id="group5-fail"
                                    value="fail"
                                    checked={conditions.group5 === "fail"}
                                    onChange={() => handleConditionChange("group5", "fail")}
                                />
                            </div>
                        ))}
                    </Form>
                </div>
                <div>
                    <textarea
                        type="text"
                        placeholder="หมายเหตุ"
                        className="report-note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>
            </div>

            {/*-----------------------------------------------------อื่นๆ------------------------------------------------------------*/}
            <div className="firedetails-button-container">
                <button
                    className="firedetails-button"
                    onClick={handleSave}
                >
                    บันทึก
                </button>
            </div>
            {isalertNo && (
                <div>
                    <AlertWarning />
                </div>
            )}
            {showPopup && (
                <div>
                    <AlertSave />
                </div>
            )}

        </div>
    );
}

export default FireDetails;
