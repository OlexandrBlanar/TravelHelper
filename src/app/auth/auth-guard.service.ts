import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, CanLoad } from '@angular/router';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/take';

@Injectable()
export class AuthGuardService implements CanLoad {
	constructor(public authService: AuthService, public router: Router) { }
	canLoad(): Observable<boolean> | boolean {
		console.log('canactivate');
		return this.authService.user.take(1).map((user) => {
			if (!user) {
				this.router.navigate(['login']);
				console.log('false');
				return false;
			} else {
				console.log('true');
				return true;
			}
		});
	}
}
