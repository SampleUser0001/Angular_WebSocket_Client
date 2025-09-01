import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebSocketService, WebSocketMessage } from './websocket.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('Angular WebSocket リアルタイム通信デモ');
  protected messages: WebSocketMessage[] = [];
  protected isConnected = false;
  protected newMessage = '';

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService.messages$.subscribe(messages => {
      this.messages = messages;
    });

    this.webSocketService.connectionStatus$.subscribe(status => {
      this.isConnected = status;
    });
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.webSocketService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }

  clearMessages(): void {
    this.webSocketService.clearMessages();
  }
}
