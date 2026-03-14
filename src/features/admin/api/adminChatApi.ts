import axiosClient from "@/lib/axiosClient";
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
        return axiosClient.get("/api/admin/chat/sessions");
    },

    // Lấy message của 1 session
    getMessages: async (
        sessionId: string
    ): Promise<AdminChatMessage[]> => {
        return axiosClient.get(
            `/api/admin/chat/sessions/${sessionId}/messages`
        );
    },

    // Đóng session
    closeSession: async (sessionId: string): Promise<void> => {
        return axiosClient.post(
            `/api/admin/chat/sessions/${sessionId}/close`
        );
    },

    uploadFile: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        console.log(file)

        const res = await axiosClient.post<string>(
            "/api/admin/chat/upload",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        return res;
    },

    markAsRead: async (sessionId: string): Promise<void> => {
        return axiosClient.post(
            `/api/admin/chat/sessions/${sessionId}/read`
        );
    },

    searchProducts: async (
        keyword: string
    ): Promise<ProductResponseDTO[]> => {
        return axiosClient.get(
            "/api/admin/products/search",
            {
                params: { keyword },
            }
        );
    },
};