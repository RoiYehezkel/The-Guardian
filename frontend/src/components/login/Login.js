import React, { useContext, useEffect, useRef, useState } from "react";
import "./Login.css";
import LoginContext from "../../context/LoginContext";
import { getAnalyze } from "../../utils/https";
import { useNavigate } from "react-router-dom";

const Login = () => {
  let navigate = useNavigate();
  const { signed, setSigned, setAnalyzedData } = useContext(LoginContext);
  const [userId, setUserId] = useState("");
  const userInputRef = useRef();

  useEffect(() => {
    userInputRef.current.focus();
  }, []);

  const handleClick = async () => {
    if (!signed) {
      setSigned(!signed);
      const data = await getAnalyze(userId);
      if (data) {
        setAnalyzedData(data);
        navigate("/result");
      } else {
        setSigned(false);
      }
    } else {
      alert("You need to logout first!");
    }
  };

  return (
    <div className="container-login">
      <div className="login-form">
        <div className="main-div">
          <div className="panel">
            <h2>Login</h2>
            <p>Please enter the code from instagram</p>
          </div>
          <div id="Login">
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                id="inputEmail"
                placeholder="USER-ID"
                onChange={(e) => setUserId(e.target.value)}
                ref={userInputRef}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={() => {
                handleClick();
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
