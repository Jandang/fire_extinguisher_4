/* eslint-disable react/prop-types */
import './Header.css'
// import LOGOW from '../../../../public/LOGOW.png';
import { Link } from 'react-router-dom';
import { FaBell } from "react-icons/fa6";
import { Dropdown } from 'react-bootstrap';
import { useState, useRef } from 'react';
function Header({ name_surname, setName_surname, setToken, setRole, setUsername }) {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  const logout = () => {
    setToken("");
    setRole("");
    setUsername("");
    setName_surname("");

    ["authToken", "userRole", "username", "nameSurname"].forEach(item => localStorage.removeItem(item));
    window.location.href = "/";
  };

  return (
    <div>
      <header className="navbarAdmin">
        <Link to={'/'}>
          <div className="whiteLogo">
            <img src="./img/whiteLogo.png" className="Logo" />
          </div>
        </Link>
        <div className='notificationContainer'>
          <div ref={target} onClick={() => setShow(!show)}>
            <FaBell className="notificationIcon" />
          </div>
        </div>
        <div >
          <Dropdown className="dropdown">
            <Dropdown.Toggle className="no-hover no-caret" style={{width: '100%',boxShadow: 'none'}}>
              <span
                className="user bi bi-person-circle">
                &nbsp;{name_surname}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                className="logout bi bi-box-arrow-left"
                onClick={logout}
              >
                &nbsp; Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>

      {show && (
        <div className='notificationDropdown'>
          <div className='notification7'>
            <span style={{display: 'flex', justifyContent: 'space-between', color: '#FD6E2B'}}>
              <p>อีก 7 วัน</p>
              <p>28/11/2024</p>
            </span>
              <p>ตรวจสอบถัง รหัส NFPA 10-0001 ถึง NFPA 10-0020</p>
          </div>
          <div className='notification14'>
            <span style={{display: 'flex', justifyContent: 'space-between', color: '#FD6E2B'}}>
              <p>อีก 14 วัน</p>
              <p>28/11/2024</p>
            </span>
              <p>ตรวจสอบถัง รหัส NFPA 10-0021 ถึง NFPA 10-0040</p>
          </div>
          <div className='notification30'>
            <span style={{display: 'flex', justifyContent: 'space-between', color: '#FD6E2B'}}>
              <p>อีก 30 วัน</p>
              <p>28/11/2024</p>
            </span>
              <p>ตรวจสอบถัง รหัส NFPA 10-0041 ถึง NFPA 10-0060</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default Header;