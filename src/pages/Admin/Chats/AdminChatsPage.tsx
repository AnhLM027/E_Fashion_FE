import { useEffect, useRef, useState, useMemo } from "react";
import { Paperclip, Upload, Image } from "lucide-react";
import {
  connectChat,
  subscribeSession,
  subscribeAdminMessages,
  subscribeAdminSessionUpdate,
  sendMessage,
  disconnectChat,
} from "@/features/chat/chatSocket";

import {
  adminChatApi,
  type AdminChatSession,
  type AdminChatMessage,
} from "@/features/admin/api/adminChatApi";

import type { Client, StompSubscription } from "@stomp/stompjs";

import { formatDateLabel, formatTime } from "@/utils/format";

export default function AdminChatsPage() {
  const [sessions, setSessions] = useState<AdminChatSession[]>([]);
  const [selectedSession, setSelectedSession] =
    useState<AdminChatSession | null>(null);

  const [messages, setMessages] = useState<AdminChatMessage[]>([]);
  const [input, setInput] = useState("");

  const clientRef = useRef<Client | null>(null);
  const sessionSubRef = useRef<StompSubscription | null>(null);
  const adminSubRef = useRef<StompSubscription | null>(null);
  const adminSessionUpdateSub = useRef<StompSubscription | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const [productResults, setProductResults] = useState<any[]>([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedSessionRef = useRef<AdminChatSession | null>(null);

  /* ================= LOAD SESSIONS ================= */

  const loadSessions = async () => {
    const res = await adminChatApi.getActiveSessions();
    setSessions(res);
  };

  /* ================= LOAD MESSAGES ================= */

  const loadMessages = async (sessionId: string) => {
    const res = await adminChatApi.getMessages(sessionId);
    setMessages(res);

    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  /* ================= SOCKET ================= */

  useEffect(() => {
    const client = connectChat((connectedClient) => {
      // console.log("SOCKET CONNECTED");
      clientRef.current = connectedClient;

      adminSubRef.current = subscribeAdminMessages((msg) => {
        // 🔥 reload sessions từ DB để lấy unreadCount chuẩn
        loadSessions();

        if (selectedSession?.id === msg.sessionId) {
          setMessages((prev) => [...prev, msg]);
        }
      });

      // subscribeAdminMessages((msg) => {
      //   console.log("ADMIN RECEIVED:", msg);
      // });

      adminSessionUpdateSub.current = subscribeAdminSessionUpdate(
        async (updatedSession) => {
          setSessions((prev) => {
            // 🔥 Nếu session bị CLOSED → remove khỏi list
            if (updatedSession.status === "CLOSED") {
              return prev.filter((s) => s.id !== updatedSession.id);
            }

            const exists = prev.some((s) => s.id === updatedSession.id);

            if (exists) {
              return prev.map((s) =>
                s.id === updatedSession.id ? { ...s, ...updatedSession } : s,
              );
            }

            return [updatedSession, ...prev];
          });
          if (selectedSessionRef.current?.id === updatedSession.id) {
            await loadMessages(updatedSession.id);
          }
          // 🔥 Nếu đang mở session đó mà nó bị CLOSED
          if (
            selectedSession?.id === updatedSession.id &&
            updatedSession.status === "CLOSED"
          ) {
            setSelectedSession(null);
            setMessages([]);
          }
        },
      );
    });

    loadSessions();

    return () => {
      sessionSubRef.current?.unsubscribe();
      adminSubRef.current?.unsubscribe();
      adminSessionUpdateSub.current?.unsubscribe();
      disconnectChat();
    };
  }, []);

  useEffect(() => {
    selectedSessionRef.current = selectedSession;
  }, [selectedSession]);

  useEffect(() => {
    if (!selectedSession || !clientRef.current?.connected) return;

    sessionSubRef.current?.unsubscribe();

    sessionSubRef.current = subscribeSession(selectedSession.id, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      sessionSubRef.current?.unsubscribe();
    };
  }, [selectedSession]);

  /* ================= SELECT SESSION ================= */

  const handleSelectSession = async (session: AdminChatSession) => {
    setSelectedSession(session);

    // 🔥 mark as read trên backend
    await adminChatApi.markAsRead(session.id);

    // reload sessions để unreadCount = 0
    await loadSessions();

    await loadMessages(session.id);

    sessionSubRef.current?.unsubscribe();

    if (clientRef.current?.connected) {
      sessionSubRef.current = subscribeSession(session.id, (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }
  };

  /* ================= SEND ================= */

  const handleSend = () => {
    if (!input.trim() || !selectedSession) return;

    sendMessage({
      sessionId: selectedSession.id,
      senderType: "AGENT",
      messageType: "TEXT",
      content: input,
    });

    setInput("");
  };

  const handleMarkAsSeen = async () => {
    if (!selectedSession) return;

    const session = sessions.find((s) => s.id === selectedSession.id);
    if (!session || session.unreadCount === 0) return;

    try {
      await adminChatApi.markAsRead(selectedSession.id);
      await loadSessions();
    } catch (err) {
      console.error("Mark as read failed", err);
    }
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || !selectedSession) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 20;

    if (isAtBottom) {
      handleMarkAsSeen();
    }
  };

  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      if (b.unreadCount !== a.unreadCount) {
        return b.unreadCount - a.unreadCount;
      }

      const timeA = new Date(a.lastTime ?? a.createdAt).getTime();
      const timeB = new Date(b.lastTime ?? b.createdAt).getTime();

      // console.log("Time: ", a.lastTime, b.lastTime)

      return timeB - timeA;
    });
  }, [sessions]);

  const scrollToBottom = (smooth = true) => {
    if (!messagesContainerRef.current) return;

    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages]);

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
    if (!selectedFile || !selectedSession) return;

    try {
      setUploading(true);

      // ✅ chỉ truyền File
      let imageUrl = await adminChatApi.uploadFile(selectedFile);

      // Nếu BE trả về path bắt đầu bằng "/uploads/..."
      if (imageUrl.startsWith("/")) {
        imageUrl = `${import.meta.env.VITE_API_URL || ""}${imageUrl}`;
      }

      sendMessage({
        sessionId: selectedSession.id,
        senderType: "AGENT",
        messageType: "IMAGE",
        content: imageUrl,
      });

      // Reset state
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

  const handleSendProduct = (product: any) => {
    if (!selectedSession) return;

    sendMessage({
      sessionId: selectedSession.id,
      senderType: "AGENT",
      messageType: "PRODUCT",
      content: product.id,
      metadata: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        thumbnail: product.thumbnail,
        price: product.salePrice ?? product.originalPrice,
        brandName: product.brandName,
      },
    });
  };

  const handleCloseSession = async () => {
    if (!selectedSession) return;

    const confirmClose = confirm("Bạn có chắc muốn đóng cuộc trò chuyện này?");
    if (!confirmClose) return;

    try {
      await adminChatApi.closeSession(selectedSession.id);

      sessionSubRef.current?.unsubscribe();
      setSelectedSession(null);
      setMessages([]);

      await loadSessions();
    } catch (err) {
      console.error("Close session failed", err);
      alert("Đóng cuộc trò chuyện thất bại");
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-2xl">
      {/* ================= LEFT SIDEBAR ================= */}
      <div className="w-[380px] bg-white/80 backdrop-blur-xl border-r flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-white/60 backdrop-blur">
          <h2 className="text-xl font-semibold">Conversations</h2>
          <p className="text-xs text-gray-400 mt-1">
            {sessions.length} active chats
          </p>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {sortedSessions.map((session) => {
            const isActive = selectedSession?.id === session.id;
            const displayName =
              session.fullName?.trim() ||
              session.email?.trim() ||
              "Tin nhắn ẩn danh";
            const avatarLetter = displayName.charAt(0).toUpperCase();

            return (
              <div
                key={session.id}
                onClick={() => handleSelectSession(session)}
                className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-200
              ${
                isActive
                  ? "bg-black text-white shadow-lg scale-[1.02]"
                  : "hover:bg-gray-100"
              }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold
                ${isActive ? "bg-white text-black" : "bg-black text-white"}`}
                >
                  {avatarLetter}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <div
                      className={`text-sm truncate ${
                        session.unreadCount > 0
                          ? "font-semibold"
                          : "font-medium"
                      }`}
                    >
                      {displayName}
                    </div>
                    <div
                      className={`text-xs ${
                        isActive ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      {formatDateLabel(session.lastTime ?? "")}
                    </div>
                  </div>

                  {session.email && (
                    <div
                      className={`text-xs truncate ${
                        isActive ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      {session.email}
                    </div>
                  )}

                  <div
                    className={`text-sm truncate mt-1 ${
                      isActive ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {session.lastMessage}
                  </div>
                </div>

                {session.unreadCount > 0 && !isActive && (
                  <div className="bg-black text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                    {session.unreadCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= RIGHT CHAT AREA ================= */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedSession ? (
          <>
            {/* ===== CHAT HEADER ===== */}
            <div className="px-8 py-5 border-b flex items-center justify-between bg-white">
              <div>
                <div className="text-lg font-semibold">
                  {selectedSession.fullName || "Tin nhắn ẩn danh"}
                </div>
                {selectedSession.email && (
                  <div className="text-xs text-gray-400">
                    {selectedSession.email}
                  </div>
                )}
              </div>

              <button
                onClick={handleCloseSession}
                className="text-xs px-4 py-2 rounded-full border border-red-400 text-red-500 hover:bg-red-50 transition"
              >
                Close
              </button>
            </div>

            {/* ===== MESSAGES ===== */}
            <div
              ref={messagesContainerRef}
              onClick={handleMarkAsSeen}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-10 py-8 space-y-6 bg-gradient-to-b from-gray-50 to-white"
            >
              {messages.map((msg, index) => {
                const isAgent = msg.senderType === "AGENT";

                const currentDate = new Date(msg.createdAt).toDateString();
                const prevDate =
                  index > 0
                    ? new Date(messages[index - 1].createdAt).toDateString()
                    : null;

                const showDateSeparator = currentDate !== prevDate;

                return (
                  <div key={msg.id}>
                    {/* ===== DATE SEPARATOR ===== */}
                    {showDateSeparator && (
                      <div className="flex justify-center my-6">
                        <div className="px-4 py-1 text-xs text-gray-500 bg-gray-200 rounded-full">
                          {formatDateLabel(msg.createdAt)}
                        </div>
                      </div>
                    )}

                    {/* ===== MESSAGE ===== */}
                    <div
                      className={`flex ${
                        msg.messageType === "SYSTEM"
                          ? "justify-center"
                          : isAgent
                            ? "justify-end"
                            : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-lg text-sm transition ${
                          msg.messageType === "SYSTEM"
                            ? "px-3 py-1 text-xs text-gray-400 italic bg-transparent shadow-none"
                            : isAgent
                              ? "px-5 py-3 rounded-3xl shadow-md bg-black text-white"
                              : "px-5 py-3 rounded-3xl shadow-md bg-white border border-gray-200"
                        }`}
                      >
                        {(() => {
                          switch (msg.messageType) {
                            case "IMAGE":
                              return (
                                <img
                                  src={msg.content}
                                  alt="attachment"
                                  className="max-w-xs rounded-2xl cursor-pointer hover:scale-105 transition"
                                  onClick={() => setZoomImage(msg.content)}
                                />
                              );

                            case "PRODUCT":
                              return (
                                <div className="w-64 bg-white text-black rounded-2xl overflow-hidden shadow">
                                  <img
                                    src={msg.metadata?.thumbnail}
                                    className="w-full h-36 object-cover"
                                  />
                                  <div className="p-3">
                                    <div className="font-semibold text-sm">
                                      {msg.metadata?.name}
                                    </div>

                                    <div className="text-xs text-gray-500">
                                      {msg.metadata?.brandName}
                                    </div>

                                    <div className="text-red-500 text-sm mt-1">
                                      {msg.metadata?.price?.toLocaleString(
                                        "vi-VN",
                                      )}{" "}
                                      đ
                                    </div>

                                    <a
                                      href={`/products/${msg.metadata?.slug}`}
                                      target="_blank"
                                      className="mt-2 block text-center bg-black text-white text-xs py-1 rounded"
                                    >
                                      View Product
                                    </a>
                                  </div>
                                </div>
                              );
                            case "SYSTEM":
                              return <div>{msg.content}</div>;

                            default:
                              return <div>{msg.content}</div>;
                          }
                        })()}

                        <div className="text-[11px] mt-2 opacity-60 text-right">
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ===== IMAGE PREVIEW ===== */}
            {previewImage && (
              <div className="px-8 py-4 border-t bg-gray-50 flex items-center gap-4">
                <img
                  src={previewImage}
                  className="w-20 h-20 object-cover rounded-xl shadow"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSendImage}
                    disabled={uploading}
                    className="bg-black text-white px-4 py-2 rounded-full text-sm"
                  >
                    {uploading ? "Sending..." : "Send Image"}
                  </button>
                  <button
                    onClick={() => {
                      setPreviewImage(null);
                      setSelectedFile(null);
                    }}
                    className="px-4 py-2 border rounded-full text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* ===== INPUT AREA ===== */}
            <div className="px-8 py-6 bg-white border-t">
              {showProductDropdown && productResults.length > 0 && (
                <div className="absolute bottom-24 left-8 right-8 bg-white shadow-2xl rounded-2xl max-h-72 overflow-y-auto z-50 border">
                  {productResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        handleSendProduct(product);
                        setInput("");
                        setShowProductDropdown(false);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer transition"
                    >
                      <img
                        src={product.thumbnail}
                        className="w-14 h-14 object-cover rounded-xl"
                      />

                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.brandName}
                        </div>
                        <div className="text-xs text-red-500 mt-1">
                          {(
                            product.salePrice ?? product.originalPrice
                          )?.toLocaleString("vi-VN")}{" "}
                          đ
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3 bg-gray-100 rounded-3xl px-5 py-3 shadow-inner">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                  <Image size={18} />
                </button>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                />

                <input
                  value={input}
                  onChange={(e) => {
                    const value = e.target.value;
                    setInput(value);

                    if (value.startsWith("/sp ")) {
                      const keyword = value.replace("/sp ", "").trim();

                      if (debounceRef.current) {
                        clearTimeout(debounceRef.current);
                      }

                      debounceRef.current = setTimeout(async () => {
                        if (keyword.length < 2) return;

                        try {
                          const results =
                            await adminChatApi.searchProducts(keyword);
                          setProductResults(results);
                          setShowProductDropdown(true);
                        } catch (err) {
                          console.error("Search product failed", err);
                        }
                      }, 400);
                    } else {
                      setShowProductDropdown(false);
                    }
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                  placeholder="Type message... (/sp to search product)"
                />

                <button
                  onClick={handleSend}
                  className="bg-black text-white px-5 py-2 rounded-full text-sm hover:scale-105 transition"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
            Select a conversation
          </div>
        )}
      </div>

      {/* ===== IMAGE ZOOM ===== */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000]"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            className="max-w-[90%] max-h-[90%] rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
