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
export function useRouteIfAuthorizedAndHeIsAdmin() {
  const navigate = useNavigate();
  const { isAuthorized, user } = useAuth();
  useEffect(() => {
    if (!isAuthorized) {
      navigate("/");
      return;
    }
    if (isAuthorized && user.isAdmin) {
      navigate("/admin/admin-home");
      return;
    }
  }, [isAuthorized, user?.isAdmin, navigate]);
}
export function useRouteIfAuthorizedAndHeIsNotAdmin() {
    const navigate = useNavigate();
    const { isAuthorized, user } = useAuth();
    useEffect(() => {
      if (!isAuthorized) {
        navigate("/");
        return;
      }
      if (isAuthorized && !user.isAdmin) {
        navigate("/home");
        return;
      }
    }, [isAuthorized, user?.isAdmin, navigate]);
  }
