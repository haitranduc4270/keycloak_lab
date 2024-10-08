import React from "react";
import useAuth from "./useAuth";

const PrivatePage = () => {
  const { token, logout } = useAuth();

  return (
    <div>
      <h1>Private Page</h1>
      <p>Your token: {token}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default PrivatePage;
