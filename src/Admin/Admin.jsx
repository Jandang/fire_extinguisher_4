/* eslint-disable react/prop-types */
import { HashRouter, Routes, Route } from "react-router-dom";

import { useState } from "react";

import Assignment from "./pages/Assignment/Assignment";
import Check from "./pages/Check/Check";
import Layout from "./layouts/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import SerialNumber from "./pages/serialNumber/SerialNumber.jsx";


function Admin({ name_surname, setName_surname, setToken, setRole, setUsername }) {

  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
  };


  return (
    <div>
      <HashRouter>
        <Routes>
          <Route element={<Layout
            name_surname={name_surname}
            setName_surname={setName_surname}
            setToken={setToken}
            setRole={setRole}
            setUsername={setUsername}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            handleSearch={handleSearch} />}>

            <Route path="/" element={<Dashboard searchValue={searchValue}
              handleSearch={handleSearch} />} />

            <Route path="/Dashboard" element={<Dashboard searchValue={searchValue}
              handleSearch={handleSearch} />} />

            <Route path="/Assignment" element={<Assignment searchValue={searchValue}
              handleSearch={handleSearch} />} />

            <Route path="/Check" element={<Check searchValue={searchValue}
              handleSearch={handleSearch} />} />

            <Route path="/SerialNumber/:serialNumber" element={<SerialNumber />} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default Admin;