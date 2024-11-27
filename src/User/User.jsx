/* eslint-disable react/prop-types */
import { HashRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import fireExtinguisher from "../Data/fireExtinguisher";
import { DeviceFrameset } from 'react-device-frameset'
import 'react-device-frameset/styles/marvel-devices.min.css'

import Layout from "./Layouts/Layout/Layout";

import Home from "./Pages/Home/Home";
import FireDetails from "./Pages/Home/FireDetails/FireDetails";
import Profile from "./Pages/Profile/Profile";
import Notifications from "./Pages/Home/Notifications/Notifications";
import Scanqrcode from "./Pages/Scanqrcode/Scanqrcode";

import "./User.css";

function User({ username, name_surname, setToken, setRole, setUsername, setName_surname }) {
  const [fireInfo, setFireInfo] = useState([]);

  useEffect(() => {
    setFireInfo(fireExtinguisher)
  }, []);



  useEffect(() => console.log(fireInfo), [fireInfo]);

  return (
    <div className="user-container">
      <DeviceFrameset device="iPhone X">
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>

            <Route path="/" element={<Home
              fireInfo={fireInfo} />} />

            <Route path="/home" element={<Home
              fireInfo={fireInfo} />} />

            <Route path="/fire-details/:serialNumber" element={<FireDetails
              fireInfo={fireInfo}
              setFireInfo={setFireInfo}
              username={username} />} />

            <Route path="/notifications" element={<Notifications
              fireInfo={fireInfo}
              username={username} />} />

            <Route path="/scanqrcode" element={<Scanqrcode />} />

            <Route path="/profile" element={<Profile
              username={username}
              name_surname={name_surname}
              setToken={setToken}
              setRole={setRole}
              setUsername={setUsername}
              setName_surname={setName_surname} />} />
          </Route>
        </Routes>
      </HashRouter>
      </DeviceFrameset>
    </div>
  );
}

export default User;
