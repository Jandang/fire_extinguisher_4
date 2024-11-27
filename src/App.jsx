
import { useState, useEffect } from "react";
import Login from "./Login/Login";
import User from "./User/User";
import Admin from "./Admin/Admin";
import SuperAdmin from "./SuperAdmin/SuperAdmin";
import GuestBranch from "./HeadGuest/Page/Guest/Guest";
import GuestSubBranch from "./SubGuest/Page/Guest/Guest";
import RouterGuest from "./PublicGuest/routerGuest";

import "./App.css";

function App() {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [name_surname, setName_surname] = useState("");

  // โหลด token และ role จาก LocalStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedRole = localStorage.getItem("userRole");
    const savedUsername = localStorage.getItem("username");
    const savedNameSurname = localStorage.getItem("nameSurname");

    if (savedToken) {
      setToken(savedToken);
      setRole(savedRole || "");
      setUsername(savedUsername || "");
      setName_surname(savedNameSurname || "");
    }
  }, []);
  // บันทึก token และ role ใน LocalStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("username", username);
      localStorage.setItem("nameSurname", name_surname);
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("username");
      localStorage.removeItem("nameSurname");
    }
  }, [token, role, username, name_surname]);

  if (token === "") {
    return (
      <Login
        setToken={setToken}
        setRole={setRole}
        setUsername={setUsername}
        setName_surname={setName_surname}
      />
    );
  } else {
    return (
      <div>
        {/* -------------------------------------User------------------------------------------ */}
        {role === "user" && (
          <User
            username={username}
            name_surname={name_surname}
            setToken={setToken}
            setRole={setRole}
            setUsername={setUsername}
            setName_surname={setName_surname}
          />
        )}
        {/* -------------------------------------Admin----------------------------------------- */}
        {role === "admin" && <Admin
          username={username}
          name_surname={name_surname}
          setToken={setToken}
          setRole={setRole}
          setUsername={setUsername}
          setName_surname={setName_surname} />}
        {/* -------------------------------------Super-Admin----------------------------------------- */}
        {role === "superAdmin" && <SuperAdmin
          username={username}
          name_surname={name_surname}
          setToken={setToken}
          setRole={setRole}
          setUsername={setUsername}
          setName_surname={setName_surname} />}
        {/* -------------------------------------HeadGuest----------------------------------------- */}
        {role === "guestBranch" && <GuestBranch
          username={username}
          name_surname={name_surname}
          setToken={setToken}
          setRole={setRole}
          setUsername={setUsername}
          setName_surname={setName_surname} />}
        {/* -------------------------------------SupGuest----------------------------------------- */}
        {role === "guestSubBranch" && <GuestSubBranch
          username={username}
          name_surname={name_surname}
          setToken={setToken}
          setRole={setRole}
          setUsername={setUsername}
          setName_surname={setName_surname} />}
        {/* -------------------------------------PublicGuest----------------------------------------- */}
        {role === "PublicGuest" && <RouterGuest
          username={username} 
          name_surname={name_surname} 
          token={token} setToken={setToken} 
          setRole={setRole} 
          role={role} />}

      </div>
    );
  }
}

export default App;
