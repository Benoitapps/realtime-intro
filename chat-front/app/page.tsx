"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Home() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("connection-log", (data) => {
      console.log(data, typeof data);
    });

    socket.on("messages", (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    socket.emit("messages", {
      content: text,
      name: "me",
      timeSent: new Date().toUTCString(),
    });

    setText("");
  };

  return (
    <main className="flex min-h-screen flex-col">
      {messages.map((m, i) => (
        <div key={i}>
          <p>{m.name}</p>
          <p>{m.content}</p>
          <time>{m.timeSent}</time>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          className="dark:text-white"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </main>
  );
}
