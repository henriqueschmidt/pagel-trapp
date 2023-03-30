import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, UntypedFormBuilder} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ManageData} from "../../../shared/components/crud/crud.component";
import {DialogMessageService} from "../../../shared/services/dialog-message.service";
import {BaseServiceService} from "../../../shared/services/base-service.service";
import {FiliaisCrudService, FilialDetail} from "../../services/filiais-crud.service";

@Component({
  selector: 'app-filiais-details',
  templateUrl: './filiais-details.component.html',
  styleUrls: ['./filiais-details.component.scss']
})
export class FiliaisDetailsComponent implements OnInit {
    filialForm: FormGroup<{
        nome: FormControl<string>;
        telefone: FormControl<string>;
        endereco: FormControl<string>;
    }>;
    private data!: FilialDetail;
    saving: boolean = false;
    isLoading: boolean = true;

    constructor(
        private formBuilder: UntypedFormBuilder,
        @Inject(MAT_DIALOG_DATA)
        public settingsData: ManageData,
        public crudService: FiliaisCrudService,
        public dialog: DialogMessageService,
        public baseService: BaseServiceService
    ) {
        this.filialForm = this.formBuilder.group({
            nome: new FormControl<string>({
                value: '',
                disabled: this.settingsData.action === 'view',
            }),
            telefone: new FormControl<string>({
                value: '',
                disabled: this.settingsData.action === 'view',
            }),
            endereco: new FormControl<string>({
                value: '',
                disabled: this.settingsData.action === 'view',
            }),
        });
    }

    ngOnInit(): void {
        if (this.settingsData.action !== 'new' && this.settingsData.id) {
            this.crudService
                .getById('filiais',this.settingsData.id)
                .subscribe(response => {
                    const data: FilialDetail = response.data as unknown as FilialDetail;
                    this.data = data;
                    this.filialForm.controls['nome'].setValue(
                        data.nome
                    );
                    this.filialForm.controls['telefone'].setValue(
                        data.telefone
                    );
                    this.filialForm.controls['endereco'].setValue(
                        data.endereco
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
        const data: FilialDetail = this.filialForm.value as FilialDetail;
        this.crudService
            .defaultSave('filiais', data, this.settingsData, this.crudService, this.dialog)
            .then(() => (this.saving = false));
    }
}
