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
