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
    <main className="flex min-h-screen flex-col justify-between p-12">
      <div className="grow ">
        {messages.map((m) => (
          <div className="chat chat-end " key={m.timeSent}>
            <div className="chat-header">{m.name}</div>
            <div className="chat-bubble chat-bubble-secondary">{m.content}</div>
            <div className="chat-footer opacity-50">
              <time className="text-xs opacity-50">{m.timeSent}</time>
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full flex gap-2 justify-center"
      >
        <input
          className="input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn">
          Send
        </button>
      </form>
    </main>
  );
}
