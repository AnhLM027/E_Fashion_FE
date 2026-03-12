export const ChatSenderType = {
  USER: "USER",
  BOT: "BOT",
  AGENT: "AGENT",
} as const;

export type ChatSenderType =
  (typeof ChatSenderType)[keyof typeof ChatSenderType];


export const ChatMessageType = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  FILE: "FILE",
  PRODUCT: "PRODUCT",
  ORDER: "ORDER",
  SYSTEM: "SYSTEM",
} as const;

export type ChatMessageType =
  (typeof ChatMessageType)[keyof typeof ChatMessageType];