import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr"; // ไลบรารีสำหรับถอดรหัส QR Code จากภาพ

import './Scanqrcode.css';

function Scanqrcode() {
    const [qrcodeScan, setQrcodeScan] = useState("No QR Code detected");
    const [isScanned, setIsScanned] = useState(false);
    const webcamRef = useRef(null);

    const capture = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();

            if (imageSrc) {
                const img = new Image();
                img.src = imageSrc;

                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");

                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0, img.width, img.height);

                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

                    const code = jsQR(imageData.data, imageData.width, imageData.height);

                    if (code) {
                        setQrcodeScan(code.data);
                        setIsScanned(true);
                    } else {
                        setQrcodeScan("No QR Code detected");
                        setIsScanned(false);
                    }
                };
            }
        }
    };

    // เรียกใช้ capture ทุกๆ 1 วินาที
    useEffect(() => {
        const interval = setInterval(capture, 500);
        return () => clearInterval(interval);
    }, []);

    const videoConstraints = {
        facingMode: "environment", // ใช้กล้องหลัง
    };

    return (
        <div className="scanqrcode-container">
            <div className="scanqrcode-header">
                <Link to="/home">
                    <span className="bi bi-arrow-left back-icon"></span>
                </Link>
                <span className="scanqrcode-title">SCAN QR CODE</span>
            </div>
            <div className="scanqrcode-webcam">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    videoConstraints={videoConstraints}
                    screenshotFormat="image/jpeg"
                    className="webcam-canvas"
                />

            </div>
            <Link to={`/fire-details/${qrcodeScan}`}>
                <button
                    onClick={capture}
                    className={`scan-button ${isScanned ? "scanned" : ""}`} disabled={!isScanned}>
                    <span className="bi bi-check-lg scan-icon"></span>
                </button>
            </Link>
        </div>
    );
}

export default Scanqrcode;
