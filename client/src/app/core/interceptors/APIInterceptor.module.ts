import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {DialogMessageService} from "../../shared/services/dialog-message.service";

@Injectable()
export class APIInterceptor implements HttpInterceptor {
    constructor(
        public router: Router,
        public dialogMessageService: DialogMessageService,
    ) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // We don't want to intercept assets requests
        if (req.url.indexOf('/assets') === 0) {
            return next.handle(req);
        }

        const url = `/api${req.url}`;
        const token = localStorage.getItem('token');
        let optionalHeaders: any = {};
        if (token) {
            optionalHeaders['headers'] = req.headers.set('Authorization', 'Bearer ' + token);
        }
        optionalHeaders['Access-Control-Allow-Origin'] = req.headers.set('Access-Control-Allow-Origin', 'http://localhost:8000')

        const apiReq = req.clone({
            ...optionalHeaders,
            url,
            // withCredentials: true,
        });
        return next.handle(apiReq).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMsg = '';
                let error_cod = 500;
                try {
                    if (error.error instanceof ErrorEvent || error instanceof HttpErrorResponse) {
                        let error_info = error.error;
                        if (typeof error_info === 'string') {
                            error_info = JSON.parse(error_info)
                        }
                        /* This is client side error */
                        errorMsg = `${error_info.message}`;
                        error_cod = error.status;
                    } else {
                        errorMsg = `Error`;
                        error_cod = 500;
                    }
                } catch (e: any) {
                    if (typeof e === 'object') {
                        errorMsg = 'Erro no servidor - ' + e.statusText;
                        if (e?.error?.message) {
                            errorMsg = e.error.message;
                        }
                    }
                }
                if (error_cod == 401) {
                    this.router.navigate(['/login'])
                    return throwError(() => new Error(errorMsg));
                }
                this.dialogMessageService.error(
                    errorMsg,
                    ['Ok'],
                    [],
                    'small',
                    `Erro código ${error_cod}`
                );
                return throwError(() => new Error(errorMsg));
            })
        );
    }
}
