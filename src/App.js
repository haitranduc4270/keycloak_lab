import React from "react";
import useAuth from "./useAuth";

const App = () => {
  const { isLogin, token, error, logout } = useAuth(); // Lấy hàm logout từ useAuth

  if (error) return <div>Error: {error}</div>;
  if (!isLogin) return <div>Loading...</div>;

  return (
    <div>
      <h1>Logged in successfully!</h1>
      <p>Token: {token}</p>
      <button onClick={logout}>Logout</button> {/* Thêm nút Logout */}
    </div>
  );
};

export default App;
