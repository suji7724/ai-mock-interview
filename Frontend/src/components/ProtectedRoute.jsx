import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children }) {

  const location = useLocation();

  const token =
    localStorage.getItem("accessToken");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  try {

    const decoded =
      jwtDecode(token);

    const currentTime =
      Date.now() / 1000;

    if (decoded.exp < currentTime) {

      localStorage.removeItem(
        "accessToken"
      );

      return (
        <Navigate
          to="/login"
          replace
        />
      );
    }

  } catch {

    localStorage.clear();

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;