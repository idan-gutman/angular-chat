import { Message } from '.';

export interface ChatRoom {
  id: string;
  roomName: string;
  messages: Message[];
  createdUserId: string;
}
