import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  public connect(url: string): Socket {
    if (!this.socket) {
      this.socket = io(url);
    }
    return this.socket;
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  public disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  public on<T>(event: string, callback: (data: T) => void): void {
    this.socket?.on(event, callback);
  }

  public off<T>(event: string, callback?: (data: T) => void): void {
    this.socket?.off(event, callback);
  }

  public emit<T>(event: string, data?: T): void {
    this.socket?.emit(event, data);
  }
}

// Экспортируем именованный объект вместо анонимного
export const socketService = new SocketService();
