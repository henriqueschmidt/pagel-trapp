import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    constructor(public http: HttpClient) {}

    checkLoggedIn() {
        return this.http.get('/is-loggedin')
    }

}
