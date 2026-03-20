export declare const SocketEvents: {
    readonly CONNECTION: "connection";
    readonly DISCONNECT: "disconnect";
    readonly USER_CHAT_REQUEST: "user_chat_request";
    readonly AI_STREAM_CHUNK: "ai_stream_chunk";
    readonly AI_CODE_GENERATED: "ai_code_generated";
    readonly AI_PROCESS_COMPLETE: "ai_process_complete";
    readonly ERROR: "error";
};
export interface ChatRequestPayload {
    messageId: string;
    content: string;
    timestamp: number;
}
export interface AIStreamChunkPayload {
    messageId: string;
    chunk: string;
    isComplete: boolean;
}
export interface CodeGeneratedPayload {
    messageId: string;
    code: string;
    description?: string;
}
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    hasCodeAttached?: boolean;
}
//# sourceMappingURL=index.d.ts.map