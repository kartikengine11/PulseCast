import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const roomId = query.get("roomId") || "default-room";
    const username = query.get("username") || "guest";
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    socket = io(backendUrl, {
      query: { roomId, username },
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("message", input);
      setMessages((prev) => [...prev, `You: ${input}`]);
      setInput("");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Socket.IO Client</h1>
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          style={{ padding: "0.5rem", width: "300px" }}
        />
        <button onClick={sendMessage} style={{ marginLeft: "1rem", padding: "0.5rem" }}>
          Send
        </button>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <h2>Messages:</h2>
        <ul>
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
