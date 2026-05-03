import React, { useEffect, useState, useContext } from "react";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "../../Context/AuthContext";


export default function ChatPage() {
  const { user } = useContext(AuthContext); // ✅ get logged in user
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // dynamic username from context, fallback to "Guest"
  const username = user?.name || user?.email || "Guest";

  useEffect(() => {
    // Load recent messages
    axios.get("http://localhost:8080/api/chat/recent").then((res) => {
      setMessages(res.data);
    });

    // Setup STOMP client
    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to WebSocket");

        stompClient.subscribe("/topic/public", (message) => {
          const msg = JSON.parse(message.body);
          setMessages((prev) => [...prev, msg]);
        });

        // announce join
        stompClient.publish({
          destination: "/app/chat.join",
          body: JSON.stringify({ sender: username }),
        });
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [username]);

  const sendMessage = () => {
    if (client && input.trim() !== "") {
      client.publish({
        destination: "/app/chat.send",
        body: JSON.stringify({
          sender: username,
          content: input,
        }),
      });
      setInput("");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center">Pulse Community : Public Chat Room</h3>
      <div className="card shadow">
        <div
          className="card-body"
          style={{ height: "600px", overflowY: "auto", background: "#f8f9fa" }}
        >
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <strong>{msg.sender}</strong>: {msg.content}
              <small className="text-muted d-block" style={{ fontSize: "12px" }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </div>
          ))}
        </div>
        <div className="card-footer d-flex">
          <input
            type="text"
            className="form-control me-5"
            value={input}
            placeholder="Type a message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="btn btn-primary" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
