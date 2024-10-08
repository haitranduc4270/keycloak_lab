import { useState, useEffect } from "react";
import Keycloak from "keycloak-js";
import { useNavigate } from "react-router-dom";

// Tạo đối tượng Keycloak
const client = new Keycloak({
  url: "http://localhost:8080/",
  realm: "myrealm",
  clientId: "myClient",
});

const useAuth = () => {
  const [token, setToken] = useState(
    localStorage.getItem("access_token") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refresh_token") || null
  );
  const [isLogin, setLogin] = useState(!!localStorage.getItem("access_token"));
  const navigate = useNavigate();

  useEffect(() => {
    // Tự động lấy token từ localStorage khi component được render
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
      setLogin(true);
    }
  }, []);

  const login = async (username, password) => {
    const body = new URLSearchParams({
      client_id: "myClient",
      grant_type: "password",
      username: username,
      password: password,
    });

    const response = await fetch(
      "http://localhost:8080/realms/myrealm/protocol/openid-connect/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      }
    );

    if (response.ok) {
      const data = await response.json();
      setLogin(true);
      setToken(data.access_token);
      setRefreshToken(data.refresh_token);

      // Lưu access_token và refresh_token vào localStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      // Điều hướng tới trang private sau khi đăng nhập thành công
      navigate("/private");
    } else {
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    // Xóa token khỏi state và localStorage
    setToken(null);
    setRefreshToken(null);
    setLogin(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // client.logout({
    //   redirectUri: window.location.origin,
    // });
    navigate("/");
  };

  const signup = async (username, password, email) => {
    const body = {
      username: username,
      email: email,
      enabled: true,
      credentials: [{ type: "password", value: password, temporary: false }],
    };

    const response = await fetch(
      "http://localhost:8080/admin/realms/myrealm/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Phải là admin token để tạo user
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      // Điều hướng đến trang login sau khi đăng ký thành công
      navigate("/login");
    } else {
      throw new Error("Sign Up failed");
    }
  };

  // Phương thức lấy access_token từ localStorage
  const getToken = () => {
    return localStorage.getItem("access_token");
  };

  return { isLogin, token, login, logout, getToken };
};

export default useAuth;
