import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const isAuthenticated = (): boolean => {
  const token = Cookies.get("accessToken");

  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      Cookies.remove("accessToken");
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
