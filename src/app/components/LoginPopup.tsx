import { Button } from "@/components/ui/button";
import React, { useRef } from "react";

function LoginPopup() {
  const popupRef = useRef<Window | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogin = () => {
    // 1. Open the window
    popupRef.current = window.open(
      "https://localhost:5055/",
      // "https://37.27.83.44:5055/",
      // "https://denimarlab.pro/login",
      "LoginWindow",
      "width=600,height=600"
    );

    // 2. Start polling every 500ms
    intervalRef.current = setInterval(() => {
      debugger
      try {
        // Check if popup is still open and has a document
        if (popupRef.current && !popupRef.current.closed) {
          // Check for the content
          const bodyText = popupRef.current.document.body.innerText;
          if (bodyText && bodyText.includes("Client login succeeds")) {
            // Success! Close popup and clear interval
            popupRef.current.close();
            if (intervalRef.current) {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
            }
            popupRef.current = null;
            // Optionally, do something else in your React app here
            alert("Login successful!");
          }
        } else {
          // Popup was closed manually
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch {
        // If cross-origin, will throw - ignore or handle gracefully
        // console.log("Can't access popup content yet", err);
      }
    }, 500);
  };

  return (
    <div>
      <Button onClick={handleLogin}>Open IBKR Login</Button>
    </div>
  );
}

export default LoginPopup;
