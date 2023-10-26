import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sound from "../assets/notification.mp3";
import { Howl } from "howler";

function Notification() {
  const [realTimeData, setRealTimeData] = useState([]);
  const [permanentData, setPermanentData] = useState([]);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [status, setStatus] = useState(false);

  const ws = useRef(null);

  let bell = parseInt(localStorage.getItem("bell") ?? 0);
  const setBell = (count) =>
    localStorage.setItem("bell", JSON.stringify(count));

  let localNotification = parseInt(localStorage.getItem("local") ?? 0);
  const setLocalNotification = (count) =>
    localStorage.setItem("local", JSON.stringify(count));

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8000/ws`);
    ws.current.onmessage = onMessage;

    const sound = new Howl({
      src: [Sound],
    });

    fetchPermanentBookingInfo();

    return () => {
      ws.current.close();
    };
  }, [status]);

  const onMessage = (ev) => {
    const sound = new Howl({
      src: [Sound],
    });
    sound.play();

    const message = ev.data;
    setRealTimeData((prevData) => [...prevData, { value: message }]);
    toast.info(message, { autoClose: 5000 });

    setBell(bell + 1);
    setLocalNotification(localNotification + 1);
    setTotalNotifications((prevTotal) => prevTotal + 1);
    fetchPermanentBookingInfo();
  };

  const fetchPermanentBookingInfo = () => {
    fetch("http://localhost:8000/get-permanent-booking-info")
      .then((response) => response.json())
      .then((data) => {
        setPermanentData(data);
        setTotalNotifications(data.length);
        setBell(bell + data.length - localNotification);
        setLocalNotification(data.length);
      })
      .catch((error) =>
        console.error("Failed to fetch permanent booking info:", error)
      );
  };

  useEffect(() => {
    document.title = `${bell ? `(${bell})` : ""} HEALTHx Admin`;
    setStatus(false);
  }, [bell, status]);

  return (
    <div className="App">
      <h1>Notification Bell: {bell}</h1>
      <button
        onClick={() => {
          setStatus(true);
          setBell(0);
        }}
      >
        View
      </button>
      <p>Total: {totalNotifications}</p>
      <ToastContainer />

      <header className="App-header">
        <h2>WebSocket Notification</h2>
      </header>

      <div className="grid">
        <div>
          <h3>Booking Information:</h3>
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
