import { useEffect, useState } from "react";
import { useAppContext } from "../App.Provider";
import { backend } from "../constants/Backend";

export function useBlockContent() {
  const appContext = useAppContext();
  const [isBlocked, setIsBlocked] = useState(false);

  const fetchIsBlocked = async () => {
    try {
      const res = await backend.post("utils/api/horas_bloqueo/", {
        campo: appContext.user.location,
      });
    } catch (error) {}
    //setIsBlocked(res.data);
    setIsBlocked(false);
  };

  useEffect(() => {
    fetchIsBlocked();
  }, []);

  return isBlocked;
}
