import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ChatRoom } from '../models';
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
}
