import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import jwtDecode from 'jwt-decode';
import { GlobalConstants } from '../shared/global-constant';
/**
 *
 */

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService {
  constructor(
    public authService: AuthService,
    public router: Router,
    private snackbarService: SnackbarService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // let expectedRoleArray = route.data;
    // expectedRoleArray = expectedRoleArray['expectedRole'];
    // const token: any = localStorage.getItem('token');
    // let tokenPayload: any = '';

    const expectedRoleArray: string[] = route.data['expectedRole'];
    const token = localStorage.getItem('token');

    if (!token) {
      this.handleUnauthorized();
      return false;
    }

    let tokenPaload: any;

    try {
      tokenPaload = jwtDecode(token);
    } catch (err) {
      this.handleUnauthorized();
      return false;
    }

    let checkRole = false;

    for (let i = 0; i < expectedRoleArray.length; i++) {
      if (expectedRoleArray[i] == tokenPaload.role) {
        checkRole = true;
      }
    }

    if (tokenPaload.role == 'user' || tokenPaload.role == 'admin') {
      if (this.authService.isAuthenticated() && checkRole) {
        return true;
      }
      this.snackbarService.openSnackBar(
        GlobalConstants.unauthorized,
        GlobalConstants.error
      );
      this.router.navigate(['/cafe/dashboard']);
      return false;
    } else {
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }
  }

  private handleUnauthorized(): void {
    localStorage.clear();
    this.snackbarService.openSnackBar(
      GlobalConstants.unauthorized,
      GlobalConstants.error
    );
    this.router.navigate(['/']);
  }
}
