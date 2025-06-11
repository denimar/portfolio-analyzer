export const openIbkrLoginPopup = (onClose: () => void) => {
  const loginWindow = window.open("https://localhost:5055/", "LoginWindow", "width=600,height=600");

  const timer = setInterval(() => {
    if (loginWindow && loginWindow.closed) {
      clearInterval(timer);
      onClose(); // Call the provided callback when the popup is closed
    }
  }, 500); // Checks every 500ms
}