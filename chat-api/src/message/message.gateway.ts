import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { IMessage } from './message.interface';

@WebSocketGateway({
  cors: true,
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userList: string[] = [];

  @SubscribeMessage('user-check')
  handleUserCheck(client: Socket, payload: string): void {
    client.emit('user-exist', {
      username: payload,
      exists: this.userList.some((user) => user === payload),
    });
  }

  @SubscribeMessage('user-add')
  handleUserAdd(client: Socket, payload: string): void {
    if (this.userList.some((user) => user === payload)) {
      client.emit('user-exist', {
        username: payload,
        exists: true,
      });

      return;
    }
    this.userList.push(payload);
  }

  @SubscribeMessage('messages')
  handleMessage(client: Socket, payload: IMessage): void {
    this.server.emit('messages', payload);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client Connected', client.id);
    this.server.emit('connection-log', {
      type: 'connection',
      id: client.id,
    });
  }
  handleDisconnect(client: Socket) {
    console.log('Client Disconnected', client.id);
    this.server.emit('connection-log', {
      type: 'disconnection',
      id: client.id,
    });
  }
}
