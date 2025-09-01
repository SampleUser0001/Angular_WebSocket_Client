import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface WebSocketMessage {
  type: string;
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messagesSubject = new BehaviorSubject<WebSocketMessage[]>([]);
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);

  public messages$ = this.messagesSubject.asObservable();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  constructor() {
    this.connect();
  }

  private connect(): void {
    try {
      this.socket = new WebSocket(environment.websocketUrl);

      this.socket.onopen = () => {
        console.log('WebSocket接続が確立されました');
        this.connectionStatusSubject.next(true);
      };

      this.socket.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          console.log('メッセージを受信:', data);
          
          const currentMessages = this.messagesSubject.value;
          this.messagesSubject.next([...currentMessages, data]);
        } catch (error) {
          console.error('メッセージの解析エラー:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket接続が切断されました');
        this.connectionStatusSubject.next(false);
        
        // 3秒後に再接続を試行
        setTimeout(() => {
          this.connect();
        }, 3000);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocketエラー:', error);
        this.connectionStatusSubject.next(false);
      };

    } catch (error) {
      console.error('WebSocket接続エラー:', error);
      this.connectionStatusSubject.next(false);
    }
  }

  public sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket接続が確立されていません');
    }
  }

  public clearMessages(): void {
    this.messagesSubject.next([]);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}