import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        public http: HttpClient
    ) { }

    login(param: { password: string; email: string }): Promise<any> {
        return this.http.post('/login', param).toPromise();
    }

}
