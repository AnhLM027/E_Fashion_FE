import axiosClient from "@/lib/axiosClient";
import { ChatSenderType, ChatMessageType } from "@/features/chat/types/chat.types";

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderType: ChatSenderType;
  messageType: ChatMessageType;
  content: string;
  metadata?: any;
  isRead?: boolean;
  createdAt: string;
}

export interface ChatSession {
  sessionId: string;
  status: string;
  unreadCount: number;
  lastContent?: string;
  lastMessageType?: string;
  lastTime?: string;
}

export const chatApi = {
  createSession: async (isLoggedIn: boolean): Promise<string> => {
    let guestId: string | null = null;

    if (!isLoggedIn) {
      guestId = localStorage.getItem("guestId");

      if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem("guestId", guestId);
      }
    }

    return axiosClient.post(
      "/api/chat/session",
      null,
      {
        params: guestId ? { guestId } : {},
      }
    );
  },

  getSession: async (isLoggedIn: boolean): Promise<ChatSession | null> => {
    let guestId: string | null = null;

    if (!isLoggedIn) {
      guestId = localStorage.getItem("guestId");

      if (!guestId) {
        // chưa từng chat -> không tạo mới ở đây
        return null;
      }
    }

    return axiosClient.get("/api/chat/session", {
      params: guestId ? { guestId } : {},
    });
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosClient.post(
      "/api/chat/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return res;
  },

  // ===== Lấy lịch sử chat =====
  getMessages: async (
    sessionId: string
  ): Promise<ChatMessage[]> => {
    return axiosClient.get(`/api/chat/${sessionId}/messages`);
  },

  markAsRead: async (sessionId: string): Promise<void> => {
    return axiosClient.post(
      `/api/chat/sessions/${sessionId}/read`
    );
  },

  mergeGuestSession: async (guestId: string) => {
    return axiosClient.post("/api/chat/merge", null, {
      params: { guestId },
    });
  },

  // ===== Gửi feedback =====
  sendFeedback: async (
    sessionId: string,
    rating: number,
    comment: string
  ): Promise<void> => {
    return axiosClient.post(
      `/api/chat/${sessionId}/feedback`,
      null,
      {
        params: { rating, comment },
      }
    );
  },
};