import React from "react";
import { Link } from "react-router-dom";

const PublicPage = () => {
  return (
    <div>
      <h1>Public Page</h1>
      <Link to="/login">
        <button>Login</button>
      </Link>
      <Link to="/signup">
        <button>Signup</button>
      </Link>
    </div>
  );
};

export default PublicPage;
