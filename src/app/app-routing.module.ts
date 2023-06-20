import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';
import { ChatContainerComponent } from './components/chat-container/chat-container.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: 'chat',
    canActivate: [authGuard],
    component: ChatContainerComponent,
  },
  {
    path: 'chat/:roomId',
    canActivate: [authGuard],
    component: ChatContainerComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
