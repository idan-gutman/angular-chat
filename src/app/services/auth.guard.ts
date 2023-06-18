import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { filter, map } from 'rxjs';

export const authGuard = () => {
  const auth = inject(AuthService);
//   return auth.isUserLoggedIn();
    const router = inject(Router);
    return auth.isUserLoggedIn().pipe(
      filter((currentUser) => currentUser !== undefined),
      map((currentUser) => {
        if (!currentUser) {
          router.navigateByUrl('/');
          return false
        }
        return true;
      })
    );
};
