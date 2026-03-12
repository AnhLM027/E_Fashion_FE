import { useEffect } from "react";
import { Client } from "@stomp/stompjs";

export default function TestWS() {
  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws-chat",
      debug: (str) => console.log(str),
    });

    client.onConnect = () => {
      console.log("Connected");

      const sessionId = "4b33d032-3d68-4d13-b202-a4bc1f778550";

      client.subscribe(`/topic/session/${sessionId}`, (msg) => {
        console.log("Received:", msg.body);
      });

      client.publish({
        destination: "/app/chat.send",
        body: JSON.stringify({
          sessionId,
          senderType: "USER",
          messageType: "TEXT",
          content: "Hello from React",
        }),
      });
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return <div>Testing WebSocket... Check console</div>;
}
