/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";

// import { verifyUser } from "../Data/users";
import users from "../Data/users";

import Form from "react-bootstrap/Form";

import "./Login.css";
import AlertPass from "../Alert/AlertPass";

function Login({ setToken, setRole, setUsername, setName_surname }) {
  const userRef = useRef();
  const passRef = useRef();



  useEffect(() => {
    // โหลดข้อมูลจาก LocalStorage
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const username = localStorage.getItem("username");
    const nameSurname = localStorage.getItem("nameSurname");

    if (token && role && username && nameSurname) {
      setToken(token);
      setRole(role);
      setUsername(username);
      setName_surname(nameSurname);
    }
  }, [setToken, setRole, setUsername, setName_surname]);

  const [isAlert, setIsAlert] = useState(false);


  return (
    <div className="login-container-background">
      <div className="login-container login-background">
        <img src="./img/MasterLogo.png" alt="logo" className="logo1" />
        <div className="username-input-container">
          <Form.Control
            type="text"
            id="username"
            placeholder="USERNAME"
            style={{
              textAlign: "center",
              border: "transparent",
              width: "300px",
              height: "55px",
              borderRadius: "28px",
              fontSize: "20px",
              fontFamily: "Unbounded",
              backgroundColor: "#d9d9d9",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
            ref={userRef}
            className="username-input"
          />
        </div>
        <Form.Control
          type="password"
          id="password"
          placeholder="PASSWORD"
          style={{
            textAlign: "center",
            border: "transparent",
            width: "300px",
            height: "55px",
            borderRadius: "28px",
            fontSize: "20px",
            fontFamily: "Unbounded",
            backgroundColor: "#d9d9d9",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
          ref={passRef}
          className="password-input"
        />
        <button
          className="btn mt-2 login-button"
          onClick={() => {
            const user = userRef.current.value.trim();
            const pass = passRef.current.value.trim();

            userRef.current.value = "";
            passRef.current.value = "";

            const storedData = localStorage.getItem("userData");
            const parsedStoredData = storedData ? JSON.parse(storedData) : [];

            const combinedUsers = [...users, ...parsedStoredData];

            const userInfo = combinedUsers.find(
              (u) => u.username === user && u.password === pass
            );

            if (userInfo) {
              // หากพบผู้ใช้
              setToken(userInfo.token);
              setRole(userInfo.role);
              setUsername(userInfo.username);
              setName_surname(userInfo.name_surname);
            } else {
              // หากไม่พบผู้ใช้

              setIsAlert(true);
              setTimeout(() => {
                setIsAlert(false);
              }, 1500);
              userRef.current.focus();

            }
          }}
        >
          Login
        </button>
        {isAlert && (
          <AlertPass />
        )}
        <button
          className="guestButton"
          onClick={() => {
            setToken("123");
            setRole("PublicGuest");
            setUsername("Guest");
            setName_surname("Guest User");
            // window.location.href = "/guest-home";
          }}
        >
          Report
        </button>

      </div>
    </div>
  );
}

export default Login;
