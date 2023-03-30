import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, UntypedFormBuilder} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs";
import {DialogMessageService} from "../../../shared/services/dialog-message.service";

interface ProfileRequest {
   success: boolean;
   data: {
       name: string;
       email: string;
       perfil: string;
       filial: string;
       setor: string;
   }
}

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    userForm: FormGroup<{
        name: FormControl<string>;
        email: FormControl<string>;
        perfil: FormControl<string>;
        filial: FormControl<string>;
        setor: FormControl<string>;
        password: FormControl<string | null>;
    }>;

    isLoading: boolean = true;
    saving: boolean = false;

    constructor(private formBuilder: UntypedFormBuilder, private http: HttpClient, private dialogMessageService: DialogMessageService) {
        this.userForm = this.formBuilder.group({
            name: new FormControl<string>({
                value: '',
                disabled: false,
            }),
            email: new FormControl<string>({
                value: '',
                disabled: false,
            }),
            perfil: new FormControl<string>({
                value: '',
                disabled: true,
            }),
            filial: new FormControl<string>({
                value: '',
                disabled: true,
            }),
            setor: new FormControl<string>({
                value: '',
                disabled: true,
            }),
            password: new FormControl<string | null>({
                value: '',
                disabled: false,
            }),
        });
    }

    ngOnInit() {
        this.http
            .get(`/profile`, {
                responseType: 'text',
            })
            .pipe(map(res => JSON.parse(res)))
            .toPromise()
            .then(
                (response : ProfileRequest) => {
                    this.isLoading = false;
                    this.userForm.setValue({
                        name: response.data.name,
                        setor: response.data.setor,
                        filial: response.data.filial,
                        perfil: response.data.perfil,
                        email: response.data.email,
                        password: null,
                    })
                }
            )
    }

    save() {
        this.saving = true;
        const headers = new HttpHeaders().set(
            'Content-type',
            'application/json'
        );
        return this.http
            .post(`/profile`, JSON.stringify({ ... this.userForm.value }), {
                headers,
                responseType: 'text',
            })
            .toPromise()
            .then(() => {
                this.dialogMessageService.success('Alterações efetuadas com sucesso').then();
                this.saving = false;
            });
    }

}
