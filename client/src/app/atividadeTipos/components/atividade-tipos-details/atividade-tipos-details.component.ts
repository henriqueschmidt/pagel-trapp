import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, UntypedFormBuilder} from "@angular/forms";
import {SetorCrudService, SetorDetail} from "../../../setores/services/setor-crud.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ManageData} from "../../../shared/components/crud/crud.component";
import {DialogMessageService} from "../../../shared/services/dialog-message.service";
import {BaseServiceService} from "../../../shared/services/base-service.service";
import {AtivadeTiposCrudService, AtividadeTiposDetail} from "../../services/ativade-tipos-crud.service";

@Component({
  selector: 'app-atividade-tipos-details',
  templateUrl: './atividade-tipos-details.component.html',
  styleUrls: ['./atividade-tipos-details.component.scss']
})
export class AtividadeTiposDetailsComponent {
    atividadeTipoForm: FormGroup<{
        nome: FormControl<string>;
    }>;
    private data!: AtividadeTiposDetail;
    saving: boolean = false;
    isLoading: boolean = true;

    constructor(
        private formBuilder: UntypedFormBuilder,
        @Inject(MAT_DIALOG_DATA)
        public settingsData: ManageData,
        public crudService: AtivadeTiposCrudService,
        public dialog: DialogMessageService,
        public baseService: BaseServiceService
    ) {
        this.atividadeTipoForm = this.formBuilder.group({
            nome: new FormControl<string>({
                value: '',
                disabled: this.settingsData.action === 'view',
            }),
        });
    }

    ngOnInit(): void {
        if (this.settingsData.action !== 'new' && this.settingsData.id) {
            this.crudService
                .getById('atividades',this.settingsData.id)
                .subscribe(response => {
                    const data: AtividadeTiposDetail = response.data as unknown as AtividadeTiposDetail;
                    this.data = data;
                    this.atividadeTipoForm.controls['nome'].setValue(
                        data.nome
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
        const data: AtividadeTiposDetail = this.atividadeTipoForm.value as AtividadeTiposDetail;
        this.crudService
            .defaultSave('atividades', data, this.settingsData, this.crudService, this.dialog)
            .then(() => (this.saving = false));
    }
}
