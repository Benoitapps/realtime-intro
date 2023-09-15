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

  private clients: { client: Socket; username: string }[] = [];

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
    this.clients.push({ client, username: '' });
  }
  handleDisconnect(client: Socket) {
    this.clients = this.clients.filter(
      ({ client: _client }) => _client.id !== client.id,
    );
  }
}
