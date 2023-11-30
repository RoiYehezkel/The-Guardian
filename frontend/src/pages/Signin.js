import React from "react";
import Login from "../components/login/Login";
import Loading from "../components/loading/Loading";
import "../App.css";

function Signin({ signed, posts }) {
  const loadingFlag = signed && posts === 0;
  return (
    <>
      <Login className="login-body" />
      {loadingFlag && <Loading />}
    </>
  );
}

export default Signin;
