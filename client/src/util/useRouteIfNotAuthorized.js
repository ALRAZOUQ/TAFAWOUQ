import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
export function useRouteIfNotAuthorized() {
  const navigate = useNavigate();
  const { isAuthorized } = useAuth();
  useEffect(() => {
    if (!isAuthorized) {
      navigate("/");
    }
  }, [isAuthorized, navigate]);
}
