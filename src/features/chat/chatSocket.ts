import {
  Client,
  type StompSubscription,
  type IMessage,
} from "@stomp/stompjs";

let client: Client | null = null;

// ===============================
// CONNECT
// ===============================
export const connectChat = (
  onConnected?: (client: Client) => void
): Client => {
  client = new Client({
    brokerURL: "ws://localhost:8080/ws-chat",
    reconnectDelay: 5000,
  });

  client.onConnect = () => {
    console.log("Chat connected");

    if (onConnected && client) {
      onConnected(client);
    }
  };

  client.onStompError = (frame) => {
    console.error("Broker error:", frame.headers["message"]);
  };

  client.activate();

  return client;
};

// ===============================
// SUBSCRIBE SESSION MESSAGE
// ===============================
export const subscribeSession = (
  sessionId: string,
  callback: (msg: any) => void
): StompSubscription | null => {

  if (!client || !client.connected) {
    console.warn("STOMP not connected yet");
    return null;
  }

  return client.subscribe(`/topic/session/${sessionId}`, (msg) => {
    callback(JSON.parse(msg.body));
  });
};

// ===============================
// ✅ SUBSCRIBE ADMIN MESSAGES (SỬA Ở ĐÂY)
// ===============================
export const subscribeAdminMessages = (
  callback: (msg: any) => void
): StompSubscription | null => {
  if (!client) return null;

  return client.subscribe("/topic/admin/messages", (msg: IMessage) => {
    callback(JSON.parse(msg.body));
  });
};

// ===============================
// SEND MESSAGE
// ===============================
export const sendMessage = (data: any) => {
  if (!client || !client.connected) return;

  client.publish({
    destination: "/app/chat.send",
    body: JSON.stringify(data),
  });
};

export const subscribeAdminSessionUpdate = (
  callback: (session: any) => void
): StompSubscription | null => {
  if (!client || !client.connected) {
    console.warn("STOMP not connected yet");
    return null;
  }

  return client.subscribe(
    "/topic/admin/session-update",
    (msg: IMessage) => {
      callback(JSON.parse(msg.body));
    }
  );
};

// ===============================
// DISCONNECT
// ===============================
export const disconnectChat = () => {
  if (client) {
    client.deactivate();
    client = null;
  }
};