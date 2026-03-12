import { useEffect, useRef, useState } from "react";
import {
  connectChat,
  subscribeSession,
  sendMessage,
  disconnectChat,
} from "../chatSocket";
import { type ChatMessage, chatApi } from "@/features/chat/api/chatApi";

import { formatDateLabel } from "@/utils/format";

import {
  ChatSenderType,
  ChatMessageType,
} from "@/features/chat/types/chat.types";

const QUICK_MESSAGES = [
  "Tôi muốn hỏi về đơn hàng",
  "Shop có sản phẩm mới không?",
  "Phí vận chuyển bao nhiêu?",
  "Tôi muốn đổi/trả hàng",
];

export default function ChatWidget() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ================= LOAD HISTORY ================= */

  useEffect(() => {
    if (!open || sessionId) return;

    const initSession = async () => {
      try {
        const id = await chatApi.createSession();
        setSessionId(id);
      } catch (error) {
        console.error("Create session failed", error);
      }
    };

    initSession();
  }, [open]);

  const createLocalMessage = (
    sessionId: string,
    senderType: ChatSenderType,
    messageType: ChatMessageType,
    content: string,
  ): ChatMessage => ({
    id: crypto.randomUUID(), // tạo id local
    sessionId,
    senderType,
    messageType,
    content,
    metadata: null,
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (!sessionId) return;

    const loadMessages = async () => {
      try {
        const res = await chatApi.getMessages(sessionId);

        if (!res || res.length === 0) {
          setMessages([
            createLocalMessage(
              sessionId,
              ChatSenderType.BOT,
              ChatMessageType.TEXT,
              "Xin chào 👋 E-Fashion có thể hỗ trợ gì cho bạn hôm nay?",
            ),
          ]);
        } else {
          setMessages(res);
        }

        setTimeout(() => scrollToBottom(false), 100);
      } catch (err) {
        console.error("Load chat history error", err);
      }
    };

    loadMessages();
  }, [sessionId]);

  /* ================= SOCKET ================= */

  useEffect(() => {
    if (!sessionId) return;

    const client = connectChat();
    let subscription: any = null;

    client.onConnect = () => {
      subscription = subscribeSession(sessionId, (msg: any) => {
        setMessages((prev) => [...prev, msg]);
        setUnreadCount((prev) => (open ? 0 : prev + 1));
      });
    };

    return () => {
      subscription?.unsubscribe();
      disconnectChat();
    };
  }, [sessionId, open]);

  /* ================= SCROLL ================= */

  const scrollToBottom = (smooth = true) => {
    if (!messagesContainerRef.current) return;

    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setUnreadCount(0);
      scrollToBottom(false);
    }
  }, [open]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (!file) continue;

          const previewUrl = URL.createObjectURL(file);

          setPreviewImage(previewUrl);
          setSelectedFile(file);
        }
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  /* ================= SEND TEXT ================= */

  const handleSend = () => {
    if (!input.trim() || !sessionId) return;

    sendMessage({
      sessionId,
      senderType: ChatSenderType.USER,
      messageType: ChatMessageType.TEXT,
      content: input,
    });

    setInput("");
  };

  /* ================= UPLOAD IMAGE ================= */

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      alert("Chỉ cho phép file ảnh");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setPreviewImage(previewUrl);
    setSelectedFile(file);
  };

  const handleSendImage = async () => {
    if (!selectedFile || !sessionId) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      let imageUrl = await chatApi.uploadImage(selectedFile);

      if (imageUrl.startsWith("/")) {
        imageUrl = `${import.meta.env.VITE_API_URL || ""}${imageUrl}`;
      }

      sendMessage({
        sessionId,
        senderType: ChatSenderType.USER,
        messageType: ChatMessageType.IMAGE,
        content: imageUrl,
      });

      // Reset
      setPreviewImage(null);
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload thất bại");
    } finally {
      setUploading(false);
    }
  };

  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const renderMessageContent = (m: any) => {
    switch (m.messageType) {
      case ChatMessageType.TEXT:
        return <div>{m.content}</div>;

      case ChatMessageType.IMAGE:
        return (
          <img
            src={m.content}
            alt="chat-img"
            className="max-w-[180px] rounded-lg cursor-pointer"
            onClick={() => setZoomImage(m.content)}
          />
        );

      case ChatMessageType.FILE:
        return (
          <a
            href={m.content}
            target="_blank"
            className="flex items-center gap-2 underline"
          >
            📎 {m.metadata?.fileName || "Tải file"}
          </a>
        );

      case ChatMessageType.PRODUCT:
        return (
          <div>
            <img
              src={m.metadata?.thumbnail}
              alt={m.metadata?.name}
              className="w-full h-36 object-cover"
            />

            <div className="p-3">
              <div className="font-semibold text-sm line-clamp-2">
                {m.metadata?.name || m.content}
              </div>

              {m.metadata?.brandName && (
                <div className="text-xs text-gray-500 mt-1">
                  {m.metadata.brandName}
                </div>
              )}

              <div className="text-red-500 text-sm mt-2 font-medium">
                {m.metadata?.price?.toLocaleString("vi-VN")} đ
              </div>

              {m.metadata?.slug && (
                <a
                  href={`/products/${m.metadata.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-center bg-black text-white text-xs py-2 rounded-lg hover:opacity-90 transition"
                >
                  Xem sản phẩm
                </a>
              )}
            </div>
          </div>
        );

      case ChatMessageType.ORDER:
        return (
          <div className="border rounded-xl p-3 bg-gray-100 text-black w-56">
            <div className="text-sm font-semibold">
              Đơn hàng: {m.metadata?.orderId || m.content}
            </div>
            <div className="text-xs mt-1">Trạng thái: {m.metadata?.status}</div>
          </div>
        );

      case ChatMessageType.SYSTEM:
        return (
          <div className="text-center text-xs text-gray-400 italic">
            {m.content}
          </div>
        );

      default:
        return <div>{m.content}</div>;
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[9999] bg-black text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition"
      >
        💬
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-24 right-6 z-30 w-96 h-120 bg-white shadow-2xl rounded-3xl flex flex-col overflow-hidden border">
          {/* Header */}
          <div className="bg-black text-white p-4 flex justify-between">
            <div>
              <div className="font-semibold text-sm">E-Fashion Support</div>
              <div className="text-xs text-green-400">Online</div>
            </div>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4"
          >
            {messages.map((m, i) => {
              const isUser = m.senderType === ChatSenderType.USER;
              const isSystem = m.messageType === ChatMessageType.SYSTEM;

              const currentDate = new Date(m.createdAt).toDateString();
              const prevDate =
                i > 0
                  ? new Date(messages[i - 1].createdAt).toDateString()
                  : null;

              const showDateSeparator = currentDate !== prevDate;

              return (
                <div key={i}>
                  {/* Date separator */}
                  {showDateSeparator && (
                    <div className="text-center text-xs text-gray-400 my-3">
                      {formatDateLabel(m.createdAt)}
                    </div>
                  )}

                  {/* Message */}
                  <div
                    className={`flex ${
                      isSystem
                        ? "justify-center"
                        : isUser
                          ? "justify-end"
                          : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 text-sm rounded-2xl shadow
    ${isSystem ? "" : isUser ? "bg-black text-white" : "bg-white border"}`}
                    >
                      {m.messageType === "SYSTEM" ? (
                        renderMessageContent(m)
                      ) : (
                        <>
                          {renderMessageContent(m)}

                          <div className="text-[10px] mt-1 opacity-60">
                            {new Date(m.createdAt).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>

          {messages.filter((m) => m.senderType === "USER").length === 0 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {QUICK_MESSAGES.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => {
                    sendMessage({
                      sessionId,
                      senderType: ChatSenderType.USER,
                      messageType: ChatMessageType.TEXT,
                      content: msg,
                    });
                  }}
                  className="text-xs bg-white border px-3 py-1 rounded-full hover:bg-black hover:text-white transition"
                >
                  {msg}
                </button>
              ))}
            </div>
          )}

          {/* Preview Before Send */}
          {previewImage && (
            <div className="p-3 border-t bg-gray-100 flex items-center gap-3">
              <img
                src={previewImage}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSendImage}
                  disabled={uploading}
                  className="bg-black text-white px-3 py-1 rounded"
                >
                  {uploading ? "Đang gửi..." : "Gửi ảnh"}
                </button>
                <button
                  onClick={() => {
                    setPreviewImage(null);
                    setSelectedFile(null);
                  }}
                  className="px-3 py-1 border rounded"
                >
                  Huỷ
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
              <button onClick={() => fileInputRef.current?.click()}>📎</button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
              />
              <input
                disabled={!sessionId}
                className="flex-1 bg-transparent text-sm focus:outline-none"
                placeholder="Nhập tin nhắn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                disabled={!sessionId}
                onClick={handleSend}
                className="bg-black text-white px-4 py-1.5 rounded-full text-sm"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000]"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            className="max-w-[90%] max-h-[90%] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </>
  );
}
