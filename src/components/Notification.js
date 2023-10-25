import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Notification() {
  const [realTimeData, setRealTimeData] = useState([]);
  const [permanentData, setPermanentData] = useState([]);
  const [totalNotifications, setTotalNotifications] = useState(0);

  let bell = parseInt(localStorage.getItem("bell") ?? 0);
  const setBell = (count) =>
    localStorage.setItem("bell", JSON.stringify(count));

  console.log("total outside", totalNotifications);
  const ws = useRef(null);

  useEffect(() => {
    // Open a WebSocket connection when the component mounts
    ws.current = new WebSocket(`ws://localhost:8000/ws`);
    ws.current.onmessage = onMessage;

    // Fetch permanent booking info
    fetchPermanentBookingInfo();
    fetchTotalNotifications();

    return () => {
      ws.current.close();
    };
  }, []);

  const onMessage = (ev) => {
    const message = ev.data;
    setRealTimeData((prevData) => [...prevData, { value: message }]);
    toast.info(message, { autoClose: 5000 });

    setBell((bell += 1));
    setTotalNotifications((prevTotal) => prevTotal + 1);
    fetchPermanentBookingInfo();
  };
  console.log("type bell", typeof bell, bell);

  const fetchPermanentBookingInfo = () => {
    // Fetch permanent booking info from the server
    fetch("http://localhost:8000/get-permanent-booking-info")
      .then((response) => response.json())
      .then((data) => {
        setPermanentData(data);
      })
      .catch((error) =>
        console.error("Failed to fetch permanent booking info:", error)
      );
  };

  const fetchTotalNotifications = () => {
    // Fetch the current total number of notifications from the server
    fetch("http://localhost:8000/get-total-notifications")
      .then((response) => response.json())
      .then((data) => {
        setTotalNotifications(data.total);
        console.log("total inside", data);
      })
      .catch((error) =>
        console.error("Failed to fetch total notifications:", error)
      );
  };

  return (
    <div className="App">
      <h1>Notification Bell: {bell}</h1>
      <ToastContainer />
      <header className="App-header">
        <h2>WebSocket Example</h2>
      </header>
      <div className="grid">
        <div>
          <h3>Permanent Booking Information:</h3>
          <ul>
            {permanentData.map((item, index) => (
              <li key={index}>{item.message}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Real-Time Notifications:</h3>
          <ul>
            {realTimeData.map((item, index) => (
              <li key={index}>{item.value}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Notification;
