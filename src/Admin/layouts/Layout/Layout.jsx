/* eslint-disable react/prop-types */
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";



function Layout({ tab, setTab, name_surname, setName_surname, searchValue, handleSearch, setToken, setRole, setUsername }) {
    return (
        <div>
            <Header
                name_surname={name_surname}
                setName_surname={setName_surname}
                setToken={setToken}
                setRole={setRole}
                setUsername={setUsername} />

            <Navbar tab={tab} setTab={setTab} searchValue={searchValue}
                handleSearch={handleSearch} />

            <Outlet />
        </div>
    );
}

export default Layout;