import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatRoom } from 'src/app/models';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  public rooms$: Observable<ChatRoom[]>;
  constructor(private chatService: ChatService) {
    this.rooms$ = this.chatService.getRooms();
  }

  ngOnInit(): void {}
}
