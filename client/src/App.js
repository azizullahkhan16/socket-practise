import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Form, Input, Button } from "antd";

const App = () => {
  const socketRef = useRef(io("http://localhost:8080"));
  const socket = socketRef.current;
  const [form] = Form.useForm();
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server", socket.id);
      setSocketId(socket.id);
    });

    socket.on("welcome", (data) => {
      console.log(data);
    });

    socket.on("newUser", (data) => {
      console.log(data);
    });

    socket.on("newMessage", (data) => {
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup function to disconnect socket on unmount
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const onFinish = (values) => {
    console.log(values);
    if (values.room && values.message) {
      socket.emit("joinRoom", { room: values.room, message: values.message });
    }

    if (values.newRoom) {
      socket.emit("newRoom", {
        newRoom: values.newRoom,
      });
    }

    form.resetFields();
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Join Room</h2>
      <h6>Room id: {socketId}</h6>
      <Form form={form} name="roomForm" layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Create Room"
          name="newRoom"
          rules={[{ required: false }]}
        >
          <Input placeholder="Enter new room name" />
        </Form.Item>
        {/* Room Input */}
        <Form.Item label="Room" name="room" rules={[{ required: false }]}>
          <Input placeholder="Enter room name" />
        </Form.Item>

        {/* Message Input */}
        <Form.Item label="Message" name="message" rules={[{ required: false }]}>
          <Input placeholder="Enter your message" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Join
          </Button>
        </Form.Item>
      </Form>

      <h2>Messages</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
