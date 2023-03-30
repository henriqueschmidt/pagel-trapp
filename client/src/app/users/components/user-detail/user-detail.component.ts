import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, UntypedFormBuilder} from "@angular/forms";
import {CrudServiceUserService, UserDetail} from "../../services/crud-service-user.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ManageData} from "../../../shared/components/crud/crud.component";
import {BaseServiceService} from "../../../shared/services/base-service.service";
import {DialogMessageService} from "../../../shared/services/dialog-message.service";
import {FilialGridItem} from "../../../filiais/services/filiais-crud.service";
import {SetorGridItem} from "../../../setores/services/setor-crud.service";

export interface PerfilGridItem {
    id: number;
    nome: string;
}

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent {
    userForm: FormGroup<{
        name: FormControl<string>;
        email: FormControl<string>;
        perfil_id: FormControl<number>;
        filial_id: FormControl<number>;
        setor_id: FormControl<number>;
        coordenadora_id: FormControl<number>;
        password: FormControl<string | null>;
    }>;
    private data!: UserDetail;
    saving: boolean = false;
    isLoading: boolean = true;
    perfis: PerfilGridItem[] = [];
    filiais: FilialGridItem[] = [];
    setores: SetorGridItem[] = [];
    coordenadoras: SetorGridItem[] = [];

    constructor(
        private formBuilder: UntypedFormBuilder,
        @Inject(MAT_DIALOG_DATA)
        public settingsData: ManageData,
        public crudService: CrudServiceUserService,
        public dialog: DialogMessageService,
        public baseService: BaseServiceService
    ) {
        this.userForm = this.formBuilder.group({
            name: new FormControl<string>({
                value: '',
                disabled: this.settingsData.action === 'view',
            }),
            email: new FormControl<string>({
                value: '',
                disabled: this.settingsData.action === 'view',
            }),
            perfil_id: new FormControl<number | null>({
                value: null,
                disabled: this.settingsData.action === 'view',
            }),
            filial_id: new FormControl<number | null>({
                value: null,
                disabled: this.settingsData.action === 'view',
            }),
            setor_id: new FormControl<number | null>({
                value: null,
                disabled: this.settingsData.action === 'view',
            }),
            coordenadora_id: new FormControl<number | null>({
                value: null,
                disabled: this.settingsData.action === 'view',
            }),
            password: new FormControl<string | null>({
                value: null,
                disabled: this.settingsData.action === 'view',
            }),
        });
    }

    ngOnInit(): void {
        this.crudService.listSelectOptions('usuarios', '/perfis').subscribe(response => {
            const data = response.data as unknown as PerfilGridItem[];
            this.perfis = data;
        })
        this.crudService.listSelectOptions('usuarios', '/filiais').subscribe(response => {
            const data = response.data as unknown as FilialGridItem[];
            this.filiais = data;
        })
        this.crudService.listSelectOptions('usuarios', '/coordenadoras').subscribe(response => {
            const data = response.data as unknown as FilialGridItem[];
            this.coordenadoras = data;
        })
        this.crudService.listSelectOptions('usuarios', '/setores').subscribe(response => {
            const data = response.data as unknown as SetorGridItem[];
            this.setores = data;
        })

        if (this.settingsData.action !== 'new' && this.settingsData.id) {
            this.crudService
                .getById('usuarios', this.settingsData.id)
                .subscribe(response => {
                    const user: UserDetail = response.data as unknown as UserDetail;
                    this.data = user;
                    this.userForm.controls['name'].setValue(
                        user.name
                    );
                    this.userForm.controls['email'].setValue(
                        user.email
                    );
                    this.userForm.controls['perfil_id'].setValue(
                        user.perfil_id
                    );
                    this.userForm.controls['filial_id'].setValue(
                        user.filial_id
                    );
                    this.userForm.controls['setor_id'].setValue(
                        user.setor_id
                    );
                    this.userForm.controls['coordenadora_id'].setValue(
                        user.coordenadora_id
                    );
                    this.isLoading = false;
                });
        } else {
            this.isLoading = false;
        }
    }

    save() {
        if (this.settingsData.action === 'view') return;
        this.saving = true;
        const data: UserDetail = this.userForm.value as UserDetail;
        this.crudService
            .defaultSave('usuarios', data, this.settingsData, this.crudService, this.dialog)
            .then(() => (this.saving = false));
    }
}
