import React from "react";
import { backend, prodURL, testingURL } from "../constants/Backend";
import { getIsTesting, storeIsTesting } from "../utils/storage";

export function useIsTesting() {
  const [isTesting, setIsTesting] = React.useState(false);

  React.useEffect(() => {
    if (isTesting) {
      backend.defaults.baseURL = testingURL;
    } else {
      backend.defaults.baseURL = prodURL;
    }
  }, [isTesting]);

  const fetchIsTesting = async () => {
    const res = await getIsTesting();
    setIsTesting(res);
  };

  const handleLongPress = () => {
    storeIsTesting(!isTesting);
    setIsTesting(!isTesting);
  };

  React.useEffect(() => {
    fetchIsTesting();
  }, []);

  return { isTesting, handleLongPress };
}
