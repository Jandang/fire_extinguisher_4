/* eslint-disable react/prop-types */

import { Link, useNavigate } from 'react-router-dom';
import fireExtinguisher from "../Data/fireExtinguisher";
import './PublicGuest.css';

function PublicGuest({ setToken, setRole }) {
    const navigate = useNavigate();
    const item = fireExtinguisher[0];

    const handleExit = () => {
        setToken("");
        setRole("");

        ["authToken", "userRole", "username", "nameSurname"].forEach(item => localStorage.removeItem(item));
        navigate("/");
    };


    return (
        <div className='publicGuestContainer'>
            <div className="mobile-container">

                {/* Back Button */}
                <span
                    onClick={handleExit} className="bi bi-arrow-left back-icon">
                </span>

                {/* Header */}
                <div className="p-3">
                    <h2 className="text-center mb-4" style={{ color: '#483D8B' }}>
                        รายละเอียด
                    </h2>
                </div>

                {/* Image Container */}
                <div className="text-center mb-3" style={{ maxWidth: '330px', margin: '0 auto' }}>
                    <div className="d-inline-block rounded p-2" style={{ maxWidth: '200px' }}>
                        <img
                            src="https://inwfile.com/s-fe/gbygvz.jpg"
                            alt="Fire Extinguisher"
                            className="img-fluid"
                        />
                    </div>
                </div>

                {/* Details Card */}
                <div className="mx-3">
                    <div className="card border mb-3">
                        <div className="card-body main">
                            <div className="mb-2">
                                <strong>S/N:</strong> {item.serialNumber}
                            </div>
                            <div className="mb-2">
                                <strong>ยี่ห้อ:</strong> {item.brand}
                            </div>
                            <div className="mb-2">
                                <strong>สถานที่:</strong> {item.site}
                            </div>
                            <div className="mb-2">
                                <strong>วันที่ผลิต:</strong> {item.mfd}
                            </div>
                            <div className="mb-2">
                                <strong>วันหมดอายุ:</strong> {item.exp}
                            </div>
                            <div className="mb-2">
                                <strong>ประเภท:</strong> ถังดับเพลิงชนิดผงเคมีแห้ง
                            </div>
                        </div>
                    </div>
                </div>

                {/* Report Button */}
                <div className="text-center mt-4 mb-4">
                    <Link to="/guestreport" className="text-decoration-none">
                        <button
                            className="btn text-white px-4 py-2"
                            style={{
                                borderRadius: '25px',
                                backgroundColor: '#dc3545'
                            }}
                        >
                            รายงาน
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default PublicGuest;