import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import Keycloak from "keycloak-js";

const client = new Keycloak({
  url: "http://192.168.0.104:8080/", // Đảm bảo url trỏ đến Keycloak server
  realm: "myrealm", // Thay bằng realm mà bạn đã cấu hình trong Keycloak
  clientId: "myClient", // Thay bằng clientId mà bạn đã cấu hình trong Keycloak
});

const useAuth = () => {
  const isRun = useRef(false);
  const [token, setToken] = useState(null);
  const [isLogin, setLogin] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isRun.current) return;

    isRun.current = true;

    // Khởi tạo Keycloak
    client
      .init({
        onLoad: "login-required",
        checkLoginIframe: false, // Giảm thiểu request không cần thiết nếu không dùng iframe
      })
      .then((authenticated) => {
        setLogin(authenticated);
        setToken(client.token);
        if (client.token) {
          const decodedToken = jwtDecode(client.token);
          console.log(decodedToken); // Lưu thông tin người dùng
        }
        // Tự động làm mới token trước khi nó hết hạn
        const refreshTokenInterval = setInterval(() => {
          if (client.token) {
            client
              .updateToken(30) // Làm mới token trước khi hết hạn 30 giây
              .then((refreshed) => {
                if (refreshed) {
                  setToken(client.token); // Cập nhật token nếu làm mới thành công
                }
              })
              .catch((err) => {
                console.error("Failed to refresh token", err);
                setError("Failed to refresh token");
              });
          }
        }, 60000); // Kiểm tra mỗi phút

        // Cleanup interval khi unmount
        return () => clearInterval(refreshTokenInterval);
      })
      .catch((err) => {
        console.error("Failed to initialize Keycloak", err);
        setError("Failed to initialize Keycloak");
      });
  }, []);

  const logout = () => {
    client
      .logout()
      .then(() => {
        setLogin(false);
        setToken(null);
      })
      .catch((err) => {
        console.error("Logout failed", err);
        setError("Logout failed");
      });
  };

  return { isLogin, token, error, logout };
};

export default useAuth;
