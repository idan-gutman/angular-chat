import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ChatRoom, Message } from '../models';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private _db: AngularFirestore) {}

  public getRooms(): Observable<ChatRoom[]> {
    return this._db
      .collection('rooms')
      .snapshotChanges()
      .pipe(
        map((snaps) => {
          return snaps.map((snap) => {
            const id = snap.payload.doc.id;
            const data: ChatRoom = snap.payload.doc.data() as ChatRoom;
            return {
              ...data,
              id,
            };
          });
        })
      );
  }

  public getRoomsMessages(roomId: string): Observable<Message[]> {
    return this._db
      .collection('rooms')
      .doc(roomId)
      .collection('messages')
      .snapshotChanges()
      .pipe(
        map((messages) => {
          return messages.map((message) => {
            const data: Message = message.payload.doc.data() as Message;
            return {
              ...data,
              id: message.payload.doc.id,
            };
          });
        })
      );
  }
}
