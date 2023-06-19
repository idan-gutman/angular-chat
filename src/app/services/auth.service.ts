import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/compat/app';
import { User } from '../models/user.interface';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isUserLoggedIn$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  private userDetails$: Subject<User> = new Subject<User>();

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    const savedUserString = localStorage.getItem('user');
    if (savedUserString !== null) {
      this.isUserLoggedIn$.next(true);
    }

    afAuth.authState.subscribe((user) => {
      if (!!user) {
        this.userDetails$.next(user as User);
        const userString: string = JSON.stringify(user);
        localStorage.setItem('user', userString);
        this.isUserLoggedIn$.next(true);
      } else {
        localStorage.removeItem('user');
        this.isUserLoggedIn$.next(false);
      }
    });
  }

  public isUserLoggedIn(): Observable<boolean> {
    return this.isUserLoggedIn$.asObservable();
  }

  public signInWithGoggle() {
    this.authLogin(new firebase.default.auth.GoogleAuthProvider());
  }

  private authLogin(provider: firebase.default.auth.AuthProvider) {
    return this.afAuth.signInWithPopup(provider).then((res) => {
      this.isUserLoggedIn$.next(true);
      this.setUserData(res.user as User);
      this.router.navigate(['chat']);
    });
  }

  private setUserData(user?: User): Promise<void> | void {
    if (!user) return;
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user?.uid}`
    );
    const userData: User = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };

    return userRef.set(userData, {
      merge: true,
    });
  }
  public sugnOut(): Promise<void> {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/']);
      this.userDetails$.next(undefined!);
    });
  }
}
