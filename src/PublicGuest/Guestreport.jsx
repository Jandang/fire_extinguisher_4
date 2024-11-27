
import { useState, useEffect } from 'react';
import './Guestreport.css';
import fireExtinguisher from "../Data/fireExtinguisher";

function Guestreport() {
    const item = fireExtinguisher[0];
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [reporterName, setReporterName] = useState('');
    const [issueText, setIssueText] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState({
        reporterName: false,
        issueText: false,
        image: false
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const thaiDate = now.toLocaleDateString('th-TH', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            });
            const thaiTime = now.toLocaleTimeString('th-TH', {
                hour: '2-digit',
                minute: '2-digit'
            });

            setCurrentDate(thaiDate);
            setCurrentTime(thaiTime);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setErrors(prev => ({ ...prev, image: false }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            reporterName: reporterName.trim() === '',
            issueText: issueText.trim() === '',
            image: !selectedImage
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const reportData = {
                date: currentDate,
                time: currentTime,
                reporterName,
                issueText,
                image: selectedImage
            };
            console.log('Submitting report:', reportData);
            setShowSuccess(true);

            // Reset form
            setReporterName('');
            setIssueText('');
            setSelectedImage(null);
            setPreviewUrl(null);
            setErrors({
                reporterName: false,
                issueText: false,
                image: false
            });

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        }
    };

    return (
        <div className="container py-4">
            {showSuccess && (
                <div className="alert alert-success text-center mb-2 fade-in">
                    รายงานสำเร็จแล้ว
                </div>
            )}
            <span
                onClick={() => window.history.back()} className="bi bi-arrow-left back-icon">
            </span>
            <div className="card mb-4">
                <div className="card-body">
                    <div
                        className={`upload-container mb-4 ${errors.image ? 'border border-danger' : ''}`}
                        onClick={() => document.getElementById('image-input').click()}
                    >
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="preview-image" />
                        ) : (
                            <div className="upload-placeholder">
                                <span className="upload-icon">⬇️</span>
                                <div className="upload-text">อัปโหลดรูปภาพ</div>
                                {errors.image && <div className="text-danger">กรุณาอัปโหลดรูปภาพ</div>}
                            </div>
                        )}
                        <input
                            type="file"
                            id="image-input"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="d-none"
                        />
                    </div>

                    <div className="info-card mb-4">
                        <div className="d-flex justify-content-between mb-2">
                            <span>วันที่ : {currentDate}</span>
                            <span>เวลา : {currentTime}</span>
                        </div>
                        <div>
                            <div>S/N : {item.serialNumber}</div>
                            <div>สถานที่ : {item.site}</div>
                        </div>
                    </div>

                    <div className="mb-2">
                        <label className="form-label">ชื่อผู้รายงาน :</label>
                        <input
                            type="text"
                            className={`form-control ${errors.reporterName ? 'is-invalid' : ''}`}
                            value={reporterName}
                            onChange={(e) => {
                                setReporterName(e.target.value);
                                setErrors(prev => ({ ...prev, reporterName: false }));
                            }}
                            placeholder="กรุณากรอกชื่อผู้รายงาน"
                        />
                        {errors.reporterName && (
                            <div className="invalid-feedback">กรุณากรอกชื่อผู้รายงาน</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="form-label">ปัญหาที่พบ :</label>
                        <textarea
                            className={`form-control ${errors.issueText ? 'is-invalid' : ''}`}
                            rows="4"
                            value={issueText}
                            onChange={(e) => {
                                setIssueText(e.target.value);
                                setErrors(prev => ({ ...prev, issueText: false }));
                            }}
                            placeholder="กรุณาระบุปัญหาที่พบ"
                        />
                        {errors.issueText && (
                            <div className="invalid-feedback">กรุณาระบุปัญหาที่พบ</div>
                        )}
                    </div>

                    <button
                        className="btn"
                        style={{
                            borderRadius: '25px',
                            backgroundColor: '#FD6E2B'
                        }}
                        onClick={handleSubmit}
                    >
                        ยืนยัน
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Guestreport;