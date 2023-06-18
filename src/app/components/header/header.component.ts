import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public isLoggedIn$: Observable<boolean>;
  constructor(private authService: AuthService) {
    this.isLoggedIn$ = authService.isUserLoggedIn();
  }
  ngOnInit(): void {}

  public loginInWithGoggle(): void {
    this.authService.signInWithGoggle();
  }
  public signOut(): void {
    this.authService.sugnOut();
  }
}
