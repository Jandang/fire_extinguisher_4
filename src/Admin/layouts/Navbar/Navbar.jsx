/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import './Navbar.css'

// eslint-disable-next-line no-unused-vars
function Navbar({ tab, setTab, searchValue, handleSearch }) {

  return (
    <div>
      <body className="navbar-container">
        <div className="button-container">
          <Link to={'/Assignment'}>
            <button className="assignment-button-admin" onClick={() => setTab('Assignment')}>มอบหมายงาน</button>
          </Link>

          <Link to={'/Check'}>
            <button className="check-button-admin" onClick={() => setTab('Check')}>ตรวจสอบงาน</button>
          </Link>

          <div className="bi bi-search search-input-container-admin">
            <input
              type="text"
              placeholder="ค้นหา : S/N, สาขา"
              className="search-input-admin"
              value={searchValue}
              onChange={handleSearch}
            />
          </div>

        </div>
      </body>
    </div>
  );
}

export default Navbar;
