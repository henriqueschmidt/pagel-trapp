import {Component, EventEmitter, Output} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    hide = true;
    form = new UntypedFormGroup({
        user: new UntypedFormControl(null, [Validators.required]),
        password: new UntypedFormControl(null, [Validators.required]),
    });
    onSubmitCall = false;

    constructor(
        public authService: AuthService,
        public router: Router
    ) {}

    ngOnInit(): void {
        localStorage.clear();
        window.postMessage('loggedin:false')
    }

    login(): void {
        const { user, password } = this.form.value;
        this.onSubmitCall = true;
        this.authService.login({ email: user, password }).then(
            (response) => {
                localStorage.setItem('user_id', response.user_id)
                localStorage.setItem('user_name', response.user_name)
                localStorage.setItem('perfil', response.perfil)
                localStorage.setItem('token', response.token)
                localStorage.setItem('abilities', JSON.stringify(response.permissoes))
                window.postMessage('loggedin:true')
                this.onSubmitCall = false;
                this.router.navigate(['/tarefas'])
            }
        );
    }
}
