import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HasRoleGuard implements CanActivate {
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        let abilities = localStorage.getItem('abilities');
        if (abilities && abilities.length > 2) {
            abilities = JSON.parse(abilities)
            // @ts-ignore
            return abilities.includes(route.data.role)
        }
        return false;
    }

}
