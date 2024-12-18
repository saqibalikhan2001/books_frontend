//@ts-nocheck
import { useState, useEffect } from "react";
import { endpoints } from "static";
import { useAxios } from "./useAxios";
import { useStore } from "./useStore";

// Custom hook to detect network status
const useNetworkStatus = () => {
  const { callAxios } = useAxios();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkPref, setnetworkPref] = useState();
  const { id_token = "", access_token = "", organization_id } = useStore({});
  // useEffect(() => {
  //   if ((id_token || access_token) && organization_id) {
  //     callAxios({
  //       url: endpoints.NETWORK_PREFERENCE,
  //     }).then((res) => {
  //       setnetworkPref(res?.preferences);
  //     });
  //   }
  //   //eslint-disable-next-line
  // }, []);
  const updateOnlineStatus = () => {
    setIsOnline(navigator.onLine);
  };

  const checkNetworkStatus = async () => {
    let attempts = 0;
    let intervelTime = networkPref?.no_of_intervals ? networkPref?.no_of_intervals : 3;
    const waiting_time = networkPref?.waiting_time ? networkPref?.waiting_time * 1000 : 20000;
    let online = false;

    const pingServer = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), waiting_time); // Timeout after 10 seconds
        const response = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          online = true;
          setIsOnline(true);
          return true; // Successful check
        }
      } catch (error) {
        // Failed check
      }
      return false;
    };

    while (attempts < intervelTime && !online) {
      const success = await pingServer();
      if (success) break;
      attempts++;
      if (attempts < 3) await new Promise((resolve) => setTimeout(resolve, waiting_time)); // Wait for 20 seconds between attempts
    }

    if (!online) {
      setIsOnline(false); // All attempts failed
    }
  };

  useEffect(() => {
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Initial check
    checkNetworkStatus();

    // Check network status periodically
    const interval = setInterval(
      checkNetworkStatus,
      networkPref?.waiting_time ? networkPref?.waiting_time * 1000 : 10000
    ); // Check every 5 seconds

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      clearInterval(interval);
    };
  }, []);

  // Function to periodically check network status by pinging a server
  // const checkNetworkStatus = async () => {
  //   try {
  //     const controller = new AbortController();
  //     const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout after 3 seconds
  //     const response = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
  //       signal: controller.signal,
  //     });
  //     clearTimeout(timeoutId);
  //     if (response.ok) {
  //       setIsOnline(true);
  //     } else {
  //       setIsOnline(false);
  //     }
  //   } catch (error) {
  //     setIsOnline(false);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener("online", updateOnlineStatus);
  //   window.addEventListener("offline", updateOnlineStatus);

  //   // Initial check
  //   checkNetworkStatus();

  //   // Check network status periodically
  //   const interval = setInterval(checkNetworkStatus, 5000); // Check every 5 seconds

  //   return () => {
  //     window.removeEventListener("online", updateOnlineStatus);
  //     window.removeEventListener("offline", updateOnlineStatus);
  //     clearInterval(interval);
  //   };
  // }, []);

  return isOnline;
};

export default useNetworkStatus;
