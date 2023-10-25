import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Notification() {
  const [data, setData] = useState([]);
  const ws = useRef(null);

  console.log("data", data);

  useEffect(() => {
    // Open a WebSocket connection when the component mounts
    ws.current = new WebSocket("ws://localhost:8000/ws");
    ws.current.onmessage = onMessage;

    return () => {
      ws.current.close();
    };
  }, []);

  const onMessage = (ev) => {
    const message = ev.data;
    setData((prevData) => [...prevData, { value: message }]);
    toast.info(`${message}`, { autoClose: 5000 });
  };

  return (
    <div className="App">
      <ToastContainer />
      <header className="App-header">
        <h2>WebSocket</h2>
      </header>
      <div>
        <ul>
          {data.map((item, index) => (
            <li key={index}>{item.value}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Notification;
