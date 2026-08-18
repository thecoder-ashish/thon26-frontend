export const getBackendUrl = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // If accessed from mobile or another network device (e.g. http://10.100.62.8:5173 or http://192.168.x.x:5173)
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1" &&
    (envUrl.includes("localhost") || envUrl.includes("127.0.0.1"))
  ) {
    return envUrl
      .replace("localhost", window.location.hostname)
      .replace("127.0.0.1", window.location.hostname);
  }

  return envUrl;
};

export const BACKEND_URL = getBackendUrl();
export default BACKEND_URL;
