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

export const chatApi = {
  // ===== Tạo hoặc lấy session ACTIVE =====
  createSession: async (): Promise<string> => {
    let guestId: string | null = null;

    // Nếu chưa login (không có token) → tạo guestId
    const token = localStorage.getItem("accessToken");

    if (!token) {
      guestId = localStorage.getItem("guestId");

      if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem("guestId", guestId);
      }
    }

    const res = await axiosClient.post(
      "/api/chat/session",
      null,
      {
        params: guestId ? { guestId } : {},
      }
    );

    return res;
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