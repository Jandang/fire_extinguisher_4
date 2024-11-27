/* eslint-disable react/prop-types */
import { useState } from 'react';

const BranchSelector = ({ branchStructure, setSelectedBranch }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div style={dropdownContainer}>
      <button
        style={{ ...dropdownButton, ...(isDropdownOpen ? activeButton : {}) }}
        type="button"
        id="branchDropdown"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {branchStructure["Bank A"].name} ({branchStructure["Bank A"].subBranches.length} sub-branches)
      </button>
      {isDropdownOpen && (
        <ul style={dropdownMenu} aria-labelledby="branchDropdown">
          {branchStructure["Bank A"].subBranches.map((branch, index) => (
            <li key={index}>
              <button
                style={dropdownItem}
                onClick={() => {
                  setSelectedBranch(branch.code);
                  setIsDropdownOpen(false);
                }}
              >
                {branch.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BranchSelector;

// CSS styles in JavaScript
const dropdownContainer = {
  position: 'relative',      // ทำให้ตำแหน่งอิงกับ container นี้
  display: 'flex',           // ใช้ Flexbox เพื่อจัดการตำแหน่ง
  justifyContent: 'center',  // จัดให้อยู่ตรงกลางแนวนอน
  alignItems: 'center',      // จัดให้อยู่ตรงกลางแนวตั้ง (ถ้าจำเป็น)
  width: '100%',             // ใช้เต็มพื้นที่
};

const dropdownButton = {
  width: '100%',
  backgroundColor: '#FD6E2B',
  color: 'white',
  padding: '0.6rem 1.2rem',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
};

const activeButton = {
  backgroundColor: '#fd8b55',
};

const dropdownMenu = {
  position: 'absolute',
  top: 'calc(100% + 0.5rem)', // เลื่อนลงมาจากปุ่ม
  left: 0,                   // เริ่มต้นจากซ้ายของ container
  marginTop: 0,
  padding: 0,
  width: '100%',             // ขยาย dropdown ให้กว้างเท่ากับ container
  listStyle: 'none',
  backgroundColor: 'white',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
  overflow: 'hidden',
};

const dropdownItem = {
  padding: '0.6rem 1.2rem',
  backgroundColor: 'transparent',
  color: '#333',
  border: 'none',
  width: '100%',
  textAlign: 'left',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
};

dropdownItem[':hover'] = {
  backgroundColor: '#f1f1f1',
};
