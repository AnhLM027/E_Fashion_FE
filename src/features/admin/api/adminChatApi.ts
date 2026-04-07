import axiosClient from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/api.config";
import { type ProductResponseDTO } from "../types/admin.type";

export interface AdminChatSession {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    createdAt: string;
    status: string;
    unreadCount: number;
    lastMessage: string | null;
    lastMessageType: "TEXT" | "IMAGE" | "FILE" | "PRODUCT" | "ORDER" | "SYSTEM";
    lastTime: string | null;
}

export interface AdminChatMessage {
    id: string;
    sessionId: string;
    senderType: "USER" | "AGENT";
    messageType: "TEXT" | "IMAGE" | "FILE" | "PRODUCT" | "ORDER" | "SYSTEM";
    metadata?: any;
    content: string;
    isRead: boolean;
    createdAt: string;
}

export const adminChatApi = {
    // Lấy danh sách session ACTIVE
    getActiveSessions: async (): Promise<AdminChatSession[]> => {
        return axiosClient.get(API_ENDPOINTS.STAFF.CHAT_SESSIONS);
    },

    // Lấy message của 1 session
    getMessages: async (
        sessionId: string
    ): Promise<AdminChatMessage[]> => {
        return axiosClient.get(
            API_ENDPOINTS.STAFF.CHAT_MESSAGES(sessionId)
        );
    },

    // Đóng session
    closeSession: async (sessionId: string): Promise<void> => {
        return axiosClient.post(
            API_ENDPOINTS.STAFF.CHAT_CLOSE(sessionId)
        );
    },

    uploadFile: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        console.log(file)

        const res = await axiosClient.post<string>(
            API_ENDPOINTS.STAFF.CHAT_UPLOAD,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        return res;
    },

    markAsRead: async (sessionId: string): Promise<void> => {
        return axiosClient.post(
            API_ENDPOINTS.STAFF.CHAT_READ(sessionId)
        );
    },

    searchProducts: async (
        keyword: string
    ): Promise<ProductResponseDTO[]> => {
        return axiosClient.get(
            API_ENDPOINTS.STAFF.PRODUCTS_SEARCH,
            {
                params: { keyword },
            }
        );
    },
};