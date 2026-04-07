import { useEffect, useRef, useState, useMemo } from "react";
import { Image, Search } from "lucide-react";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const [productResults, setProductResults] = useState<any[]>([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedSessionRef = useRef<AdminChatSession | null>(null);

  const [searchSession, setSearchSession] = useState("");

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
    connectChat((connectedClient) => {
      clientRef.current = connectedClient;

      adminSubRef.current = subscribeAdminMessages((msg) => {
        loadSessions();

        if (selectedSession?.id === msg.sessionId) {
          setMessages((prev) => [...prev, msg]);
        }
      });

      adminSessionUpdateSub.current = subscribeAdminSessionUpdate(
        async (updatedSession) => {
          setSessions((prev) => {
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

    sessionSubRef.current = subscribeSession(
      selectedSession.id,
      async (msg) => {
        if (msg.type === "READ") {
          setMessages((prev) =>
            prev.map((m) =>
              m.senderType === "AGENT" ? { ...m, isRead: true } : m,
            ),
          );
          return;
        }

        setMessages((prev) => [...prev, msg]);

        if (msg.senderType === "AGENT") {
          try {
            await adminChatApi.markAsRead(selectedSession.id);
            loadSessions();
          } catch (err) {
            console.error("Realtime markAsRead failed", err);
          }
        }
      },
    );

    return () => {
      sessionSubRef.current?.unsubscribe();
    };
  }, [selectedSession]);

  /* ================= SELECT SESSION ================= */

  const handleSelectSession = async (session: AdminChatSession) => {
    setSelectedSession(session);
    await adminChatApi.markAsRead(session.id);
    await loadSessions();
    await loadMessages(session.id);

    sessionSubRef.current?.unsubscribe();

    if (clientRef.current?.connected) {
      sessionSubRef.current = subscribeSession(session.id, (msg) => {
        if (msg.type === "READ") {
          setMessages((prev) =>
            prev.map((m) =>
              m.senderType === "AGENT" ? { ...m, isRead: true } : m,
            ),
          );
          return;
        }
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
      alert("Only images allowed");
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
      let imageUrl = await adminChatApi.uploadFile(selectedFile);

      if (imageUrl.startsWith("/")) {
        imageUrl = `${import.meta.env.VITE_API_URL || ""}${imageUrl}`;
      }

      sendMessage({
        sessionId: selectedSession.id,
        senderType: "AGENT",
        messageType: "IMAGE",
        content: imageUrl,
      });

      setPreviewImage(null);
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
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

    const confirmClose = confirm("Are you sure you want to close this conversation?");
    if (!confirmClose) return;

    try {
      await adminChatApi.closeSession(selectedSession.id);
      sessionSubRef.current?.unsubscribe();
      setSelectedSession(null);
      setMessages([]);
      await loadSessions();
    } catch (err) {
      console.error("Close session failed", err);
      alert("Failed to close conversation");
    }
  };

  const renderSessionPreview = (session: AdminChatSession) => {
    if (!session.lastMessage) return "New session started";

    switch (session.lastMessageType) {
      case "IMAGE":
        return "📷 Image attachment";
      case "PRODUCT":
        return "🛍️ Product reference";
      default:
        return session.lastMessage;
    }
  };

  const lastAgentMessageIndex = [...messages]
    .reverse()
    .findIndex((m) => m.senderType === "AGENT");

  const lastAgentIndex =
    lastAgentMessageIndex === -1
      ? -1
      : messages.length - 1 - lastAgentMessageIndex;

  const filteredSessions = useMemo(() => {
    let data = [...sessions];

    if (searchSession.trim()) {
      const keyword = searchSession.toLowerCase();
      data = data.filter(
        (s) =>
          s.fullName?.toLowerCase().includes(keyword) ||
          s.email?.toLowerCase().includes(keyword),
      );
    }

    return data.sort((a, b) => {
      if (b.unreadCount !== a.unreadCount) {
        return b.unreadCount - a.unreadCount;
      }
      const timeA = new Date(a.lastTime ?? a.createdAt).getTime();
      const timeB = new Date(b.lastTime ?? b.createdAt).getTime();
      return timeB - timeA;
    });
  }, [sessions, searchSession]);

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm animate-in fade-in duration-500">
      {/* ================= LEFT SIDEBAR ================= */}
      <div className="w-[320px] bg-zinc-50 border-r border-zinc-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 bg-white">
          <h2 className="text-lg font-bold text-zinc-900 leading-none">Chats</h2>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1.5 leading-none">
            {sessions.length} ACTIVE SESSIONS
          </p>
        </div>

        <div className="p-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              value={searchSession}
              onChange={(e) => setSearchSession(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all font-medium"
            />
          </div>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
          {filteredSessions.map((session) => {
            const isActive = selectedSession?.id === session.id;
            const displayName = session.fullName?.trim() || session.email?.trim() || "User";
            const avatarLetter = displayName.charAt(0).toUpperCase();

            return (
              <div
                key={session.id}
                onClick={() => handleSelectSession(session)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
              ${
                isActive
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "hover:bg-zinc-100"
              }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                ${isActive ? "bg-white text-zinc-900" : "bg-zinc-200 text-zinc-600"}`}
                >
                  {avatarLetter}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <div
                      className={`text-[13px] truncate ${
                        session.unreadCount > 0 ? "font-bold" : "font-semibold"
                      }`}
                    >
                      {displayName}
                    </div>
                    <div className="text-[10px] font-bold text-zinc-400 flex shrink-0 ml-2">
                      {formatTime(session.lastTime ?? session.createdAt)}
                    </div>
                  </div>

                  <div
                    className={`text-[11px] truncate ${
                      isActive ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    {renderSessionPreview(session)}
                  </div>
                </div>

                {session.unreadCount > 0 && !isActive && (
                  <div className="bg-zinc-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0 border border-white">
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
            <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600 border border-zinc-200">
                  {(selectedSession.fullName || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900 leading-none">
                    {selectedSession.fullName || "Anonymous User"}
                  </div>
                  {selectedSession.email && (
                    <div className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-wider">
                      {selectedSession.email}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleCloseSession}
                className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
              >
                Close Session
              </button>
            </div>

            {/* ===== MESSAGES ===== */}
            <div
              ref={messagesContainerRef}
              onClick={handleMarkAsSeen}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-zinc-50/30"
            >
              {messages.map((msg, index) => {
                const isAgent = msg.senderType === "AGENT";
                const currentDate = new Date(msg.createdAt).toDateString();
                const prevDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
                const showDateSeparator = currentDate !== prevDate;

                return (
                  <div key={msg.id}>
                    {showDateSeparator && (
                      <div className="flex justify-center my-8">
                        <div className="px-3 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-100 rounded-md border border-zinc-200">
                          {formatDateLabel(msg.createdAt)}
                        </div>
                      </div>
                    )}

                    <div className={`flex ${msg.messageType === "SYSTEM" ? "justify-center" : isAgent ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] transition-all ${
                        msg.messageType === "SYSTEM"
                          ? "px-4 py-1 text-[11px] text-zinc-400 italic bg-transparent"
                          : isAgent
                            ? "px-4 py-3 rounded-2xl rounded-tr-none bg-zinc-900 text-white shadow-sm"
                            : "px-4 py-3 rounded-2xl rounded-tl-none bg-white text-zinc-900 border border-zinc-200 shadow-sm"
                      }`}>
                        {(() => {
                          switch (msg.messageType) {
                            case "IMAGE":
                              return (
                                <img
                                  src={msg.content}
                                  alt="attachment"
                                  className="max-w-xs rounded-xl cursor-default"
                                />
                              );
                            case "PRODUCT":
                              return (
                                <div className="w-56 bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                                  <img src={msg.metadata?.thumbnail} className="w-full h-32 object-cover" />
                                  <div className="p-3">
                                    <div className="font-bold text-xs text-zinc-900 line-clamp-1">{msg.metadata?.name}</div>
                                    <div className="text-[10px] font-bold text-zinc-400 uppercase mt-0.5">{msg.metadata?.brandName}</div>
                                    <div className="text-zinc-900 font-bold text-xs mt-1.5">{msg.metadata?.price?.toLocaleString()}₫</div>
                                    <a
                                      href={`/products/${msg.metadata?.slug}`}
                                      target="_blank"
                                      className="mt-3 block text-center bg-zinc-900 text-white text-[10px] font-bold py-1.5 rounded uppercase tracking-wider hover:bg-zinc-800 transition-colors"
                                    >
                                      View Item
                                    </a>
                                  </div>
                                </div>
                              );
                            case "SYSTEM":
                              return <div className="text-center">{msg.content}</div>;
                            default:
                              return <div className="leading-relaxed text-[13px]">{msg.content}</div>;
                          }
                        })()}

                        <div className={`text-[9px] font-bold mt-2 flex items-center justify-end uppercase tracking-widest ${isAgent ? "text-zinc-400/80" : "text-zinc-400"}`}>
                          {formatTime(msg.createdAt)}
                          {isAgent && index === lastAgentIndex && msg.isRead && (
                            <span className="ml-2 font-black">• Seen</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ===== IMAGE PREVIEW ===== */}
            {previewImage && (
              <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={previewImage} className="w-16 h-16 object-cover rounded-lg border border-zinc-200 shadow-sm" />
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Ready to send attachment</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setPreviewImage(null); setSelectedFile(null); }}
                    className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendImage}
                    disabled={uploading}
                    className="bg-zinc-900 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-zinc-800 disabled:opacity-40 transition-all uppercase tracking-widest"
                  >
                    {uploading ? "Uploading..." : "Send Attachment"}
                  </button>
                </div>
              </div>
            )}

            {/* ===== INPUT AREA ===== */}
            <div className="px-6 py-4 bg-white border-t border-zinc-200">
               {showProductDropdown && productResults.length > 0 && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-xl w-full max-w-md max-h-64 overflow-y-auto z-50 border border-zinc-200 p-2 divide-y divide-zinc-100">
                  {productResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        handleSendProduct(product);
                        setInput("");
                        setShowProductDropdown(false);
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-zinc-50 cursor-pointer transition rounded-lg"
                    >
                      <img src={product.thumbnail} className="w-12 h-12 object-cover rounded-lg border border-zinc-200" />
                      <div className="flex-1">
                        <div className="text-xs font-bold text-zinc-900">{product.name}</div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase">{product.brandName}</div>
                        <div className="text-xs font-bold text-zinc-900 mt-0.5">{(product.salePrice ?? product.originalPrice)?.toLocaleString()}₫</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3 bg-zinc-100 rounded-xl px-4 py-2 border border-zinc-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-900 transition-all">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors"
                  title="Upload Image"
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
                      if (debounceRef.current) clearTimeout(debounceRef.current);
                      debounceRef.current = setTimeout(async () => {
                        if (keyword.length < 2) return;
                        try {
                          const results = await adminChatApi.searchProducts(keyword);
                          setProductResults(results);
                          setShowProductDropdown(true);
                        } catch (err) { console.error(err); }
                      }, 400);
                    } else if (showProductDropdown) {
                      setShowProductDropdown(false);
                    }
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                  placeholder="Type a message or use /sp to search products..."
                  className="flex-1 bg-transparent border-none text-sm focus:ring-0 placeholder:text-zinc-400"
                />

                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="text-xs font-bold uppercase tracking-widest text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed hover:text-zinc-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-zinc-50/50">
            <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center text-zinc-300 mb-6 shadow-sm">
                <Search size={32} />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Select a conversation</h3>
            <p className="text-xs text-zinc-500 max-w-[240px] mt-2 leading-relaxed">
              Choose a session from the left sidebar to start messaging and managing customer inquiries.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
