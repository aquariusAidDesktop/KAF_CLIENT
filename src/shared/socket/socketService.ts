import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  public connect(url: string) {
    if (!this.socket) {
      this.socket = io(url);
    }
    return this.socket;
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  public disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  public on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  public off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }

  public emit(event: string, data?: any) {
    this.socket?.emit(event, data);
  }
}

export default new SocketService();
