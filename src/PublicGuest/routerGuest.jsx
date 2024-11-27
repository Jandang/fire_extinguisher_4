/* eslint-disable react/prop-types */

import { HashRouter, Routes, Route, } from "react-router-dom";
import { DeviceFrameset } from 'react-device-frameset'
import 'react-device-frameset/styles/marvel-devices.min.css'
import Guestreport from "./Guestreport";
import PublicGuest from "./PublicGuest";
import './routerGuest.css';

function RouterGuest({ setToken, setRole, setUsername, setName_surname }) {

    return (
        <div className="publicGuestContainer">
            <DeviceFrameset device="iPhone X">
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<PublicGuest
                            setToken={setToken}
                            setRole={setRole}
                            setUsername={setUsername}
                            setName_surname={setName_surname} />} />
                        <Route path="/publicguest" element={<PublicGuest
                            setToken={setToken}
                            setRole={setRole}
                            setUsername={setUsername}
                            setName_surname={setName_surname} />} />
                        <Route path="/guestreport" element={<Guestreport
                            setToken={setToken}
                            setRole={setRole}
                            setUsername={setUsername}
                            setName_surname={setName_surname} />} />
                    </Routes>
                </HashRouter>
            </DeviceFrameset>
        </div>
    );
}

export default RouterGuest;