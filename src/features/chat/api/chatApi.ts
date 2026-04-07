import axiosClient from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/api.config";
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
      API_ENDPOINTS.DISCOVERY.CHAT_SESSION,
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

    return axiosClient.get(API_ENDPOINTS.DISCOVERY.CHAT_SESSION, {
      params: guestId ? { guestId } : {},
    });
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosClient.post(
      API_ENDPOINTS.DISCOVERY.CHAT_UPLOAD,
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
    return axiosClient.get(API_ENDPOINTS.DISCOVERY.CHAT_MESSAGES(sessionId));
  },

  markAsRead: async (sessionId: string): Promise<void> => {
    return axiosClient.post(
      API_ENDPOINTS.DISCOVERY.CHAT_READ(sessionId)
    );
  },

  mergeGuestSession: async (guestId: string) => {
    return axiosClient.post(API_ENDPOINTS.DISCOVERY.CHAT_MERGE, null, {
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
      API_ENDPOINTS.DISCOVERY.CHAT_FEEDBACK(sessionId),
      null,
      {
        params: { rating, comment },
      }
    );
  },
};