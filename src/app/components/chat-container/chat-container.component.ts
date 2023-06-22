import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { Observable, Subscription, filter } from 'rxjs';
import { ChatRoom, Message } from 'src/app/models';
import { ChatService } from 'src/app/services/chat.service';
import { AddRoomComponent } from '../add-room/add-room.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss'],
})
export class ChatContainerComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  private userId: string = '';
  public rooms$: Observable<ChatRoom[]>;
  public messages$: Observable<Message[]>;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.rooms$ = this.chatService.getRooms();
    const roomId: string = activatedRoute.snapshot?.url[1]?.path;
    this.messages$ = this.chatService.getRoomsMessages(roomId);

    this.subscription.add(
      router.events
        .pipe(filter((data) => data instanceof NavigationEnd))
        .subscribe((data) => {
          const routeEvent: RouterEvent = data as RouterEvent;
          const urlArr = routeEvent.url.split('/');
          if (urlArr.length > 2) {
            this.messages$ = this.chatService.getRoomsMessages(urlArr[2]);
          }
        })
    );
  }

  ngOnInit(): void {
    this.authService
      .getUserData()
      .pipe(filter((data) => !!data))
      .subscribe((user) => {
        this.userId = user.uid;
      });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public opemAddRoomModal(): void {
    const dialogRef = this.dialog.open(AddRoomComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      this.onAddRoom(result,this.userId);
    });
  }
  public onAddRoom(roomName: string, userId: string) {
    this.chatService.addRoom(roomName, userId);
  }
}
