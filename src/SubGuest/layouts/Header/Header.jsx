/* eslint-disable react/prop-types */
import { useState } from 'react';
import './Header.css';
// import { Notification02Icon } from 'hugeicons-react';
import { UserCircle02Icon } from 'hugeicons-react';
import Dropdown from 'react-bootstrap/Dropdown';

function Header({ name_surname }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    const handleLogout = () => {
        // Clear authentication token from local storage
        localStorage.removeItem('authToken');

        // Redirect to login page
        window.location.href = '/';

        // Optional: Clear any other user-related data
        localStorage.removeItem('userInfo');

        // Optional: Log out from backend (if needed)
        // fetch('/api/logout', { method: 'POST' });

        console.log('User logged out');
    };

    return (
        <div className="header-container">
            <div className='left'>
                <span>
                    <img 
                        src="./img/whiteLogo.png"
                        alt="LOGO"
                        style={{ height: '50px',marginLeft: '20px' }}
                    />
                </span>
            </div>
            <div className='right'>
                <Dropdown
                    show={isDropdownOpen}
                    onToggle={(nextShow) => setIsDropdownOpen(nextShow)}
                >
                    <Dropdown.Toggle
                        as="div"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <UserCircle02Icon
                            size={"30"}
                            variant={"stroke"}
                        />
                        <span style={{ fontSize: '20px', marginLeft: '10px' }}>
                            {name_surname}
                        </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleLogout}>
                            <div className="bi bi-box-arrow-left" /> Logout
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>


            </div>
        </div>
    );
}

export default Header;