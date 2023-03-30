import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, UntypedFormBuilder} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ManageData} from "../../../shared/components/crud/crud.component";
import {DialogMessageService} from "../../../shared/services/dialog-message.service";
import {BaseServiceService} from "../../../shared/services/base-service.service";
import {SetorCrudService, SetorDetail} from "../../services/setor-crud.service";

@Component({
  selector: 'app-setor-details',
  templateUrl: './setor-details.component.html',
  styleUrls: ['./setor-details.component.scss']
})
export class SetorDetailsComponent {
    setorForm: FormGroup<{
        nome: FormControl<string>;
    }>;
    private data!: SetorDetail;
    saving: boolean = false;
    isLoading: boolean = true;

    constructor(
        private formBuilder: UntypedFormBuilder,
        @Inject(MAT_DIALOG_DATA)
        public settingsData: ManageData,
        public crudService: SetorCrudService,
        public dialog: DialogMessageService,
        public baseService: BaseServiceService
    ) {
        this.setorForm = this.formBuilder.group({
            nome: new FormControl<string>({
                value: '',
                disabled: this.settingsData.action === 'view',
            }),
        });
    }

    ngOnInit(): void {
        if (this.settingsData.action !== 'new' && this.settingsData.id) {
            this.crudService
                .getById('setores',this.settingsData.id)
                .subscribe(response => {
                    const data: SetorDetail = response.data as unknown as SetorDetail;
                    this.data = data;
                    this.setorForm.controls['nome'].setValue(
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
        const data: SetorDetail = this.setorForm.value as SetorDetail;
        this.crudService
            .defaultSave('setores', data, this.settingsData, this.crudService, this.dialog)
            .then(() => (this.saving = false));
    }
}
