import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormArray, FormControl, FormGroup, UntypedFormBuilder, Validators} from "@angular/forms";
import {SetorCrudService, SetorDetail} from "../../../setores/services/setor-crud.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ManageData} from "../../../shared/components/crud/crud.component";
import {DialogMessageService} from "../../../shared/services/dialog-message.service";
import {BaseServiceService} from "../../../shared/services/base-service.service";
import {TaskDetail, TaskDetailSave} from "../../services/task-crud.service";
import {PermissionsService} from "../../../auth/services/permissions.service";
import {forkJoin} from "rxjs";

export interface UserSelectOption {
    id: number;
    name: string;
}

export interface SelectOption {
    id: number;
    nome: string;
    perfil?: string;
}

@Component({
    selector: 'app-tasks-detail',
    templateUrl: './tasks-detail.component.html',
    styleUrls: ['./tasks-detail.component.scss'],
    encapsulation : ViewEncapsulation.None,
})
export class TasksDetailComponent {
    tarefaForm: FormGroup<{
        nome: FormControl<string>;
        responsavel_user_id: FormControl<number | null>;
        tarefa_status_id: FormControl<number | null>;
        entrega_dt: FormControl<Date>;
        limite_dt: FormControl<Date>;
        descricao: FormControl<string>;
        descricao_execucao: FormControl<string | null>;
        solicitante_id: FormControl<number | null>;
        atividade_id: FormControl<number | null>;
        solicitado_em: FormControl<Date | null>;
        filial: FormControl<string | null>;
        processo_numero: FormControl<string | null>;
        executamentos: FormArray<FormGroup>;
    }>;
    private data!: SetorDetail;
    saving: boolean = false;
    isLoading: boolean = true;
    coordenadoras: UserSelectOption[] = [];
    colaboradoras: UserSelectOption[] = [];
    users: UserSelectOption[] = [];
    status: SelectOption[] = [];
    atividades: SelectOption[] = [];
    user_perfil: string = '';
    responsavel_type: string = '';
    can_edit_executamentos: boolean = false;
    display_encerrar_button: boolean = false;
    last_coordenadora: number | null = 0;

    constructor(
        private formBuilder: UntypedFormBuilder,
        @Inject(MAT_DIALOG_DATA)
        public settingsData: ManageData,
        public crudService: SetorCrudService,
        public dialog: DialogMessageService,
        public baseService: BaseServiceService,
        public permissionService: PermissionsService
    ) {
        const is_new = this.settingsData.action === 'new';
        const is_editing = this.settingsData.action === 'edit';
        const can_edit_all = is_new || (is_editing && permissionService.hasPerfil(['diretoria', 'dev', 'admin', 'secretaria']))
        this.can_edit_executamentos = can_edit_all;
        this.tarefaForm = this.formBuilder.group({
            nome: new FormControl<string>({
                value: '',
                disabled: this.settingsData.action === 'view' || !can_edit_all,
            }),
            responsavel_user_id: new FormControl<number | null>({
                value: null,
                disabled: this.settingsData.action === 'view' || !can_edit_all,
            }),
            tarefa_status_id: new FormControl<number | null>({
                value: null,
                disabled: this.settingsData.action === 'view' || !can_edit_all,
            }),
            entrega_dt: new FormControl<Date | null>({
                value: null,
                disabled: this.settingsData.action === 'view' || !can_edit_all,
            }),
            limite_dt: new FormControl<Date | null>({
                value: null,
                disabled: this.settingsData.action === 'view' || !can_edit_all,
            }),
            descricao: new FormControl<string | null>({
                value: null,
                disabled: this.settingsData.action === 'view' || !can_edit_all,
            }),
            descricao_execucao: new FormControl<string | null>({
                value: null,
                disabled: this.settingsData.action === 'view' || !can_edit_all,
            }),
            solicitante_id: new FormControl<number | null>({
                value: null,
                disabled: true,
            }),
            atividade_id: new FormControl<number | null>({
                value: null,
                disabled: this.settingsData.action === 'view' || !can_edit_all,
            }),
            solicitado_em: new FormControl<Date | null>({
                value: null,
                disabled: true,
            }),
            filial: new FormControl<string | null>({
                value: null,
                disabled: true,
            }),
            processo_numero: new FormControl<string | null>({
                value: null,
                disabled: this.settingsData.action === 'view' || !can_edit_all,
            }),
            executamentos: new FormArray([]),
        });
    }

    ngOnInit(): void {
        this.tarefaForm.controls.responsavel_user_id.valueChanges.subscribe(value => {
            this.crudService.listSelectOptions('tarefas', `/colaboradoras/${value}`).subscribe(response => {
                if (value !== this.last_coordenadora) {
                    this.colaboradoras = response.data as unknown as UserSelectOption[];
                    this.last_coordenadora = value;
                }
            })
        })

        forkJoin({
            coordenadoras: this.crudService.listSelectOptions('tarefas', '/coordenadoras'),
            colaboradoras: this.crudService.listSelectOptions('tarefas', '/colaboradoras/0'),
            status: this.crudService.listSelectOptions('tarefas', '/status'),
            users: this.crudService.listSelectOptions('tarefas', '/users'),
            atividades: this.crudService.listSelectOptions('tarefas', '/atividades'),
        }).subscribe(
            responses => {
                this.coordenadoras = responses.coordenadoras.data as unknown as UserSelectOption[];
                this.colaboradoras = responses.colaboradoras.data as unknown as UserSelectOption[];
                this.users = responses.users.data as unknown as UserSelectOption[];
                this.status = responses.status.data as unknown as SelectOption[];
                this.atividades = responses.atividades.data as unknown as SelectOption[];

                if (this.settingsData.action !== 'new' && this.settingsData.id) {
                    this.crudService.getById('tarefas',this.settingsData.id).subscribe(
                        response => {
                            const data: TaskDetailSave = response.data as unknown as TaskDetailSave;
                            this.setData(data);
                            const current_user = localStorage.getItem('user_id');
                            if (data.solicitacao_user_id+'' === current_user && this.settingsData.action !== 'view') {
                                this.tarefaForm.controls.nome.enable();
                                this.tarefaForm.controls.responsavel_user_id.enable();
                                this.tarefaForm.controls.entrega_dt.enable();
                                this.tarefaForm.controls.limite_dt.enable();
                                this.tarefaForm.controls.descricao.enable();
                                this.tarefaForm.controls.descricao_execucao.enable();
                                this.tarefaForm.controls.tarefa_status_id.enable();
                                this.tarefaForm.controls.processo_numero.enable();
                                this.tarefaForm.controls.atividade_id.enable();
                                this.can_edit_executamentos = true;
                                this.display_encerrar_button = true;
                            }

                            if (
                                this.permissionService.hasPerfil(['coordenadora', 'subcoordenadora']) && data.responsavel_user_id+'' === current_user) {
                                this.tarefaForm.controls.descricao_execucao.enable();
                                this.can_edit_executamentos = true;
                                this.display_encerrar_button = true;
                            }

                            if (this.permissionService.hasPerfil('subcoordenadora') && data.tarefa_status_id === 4) {
                                this.tarefaForm.controls.nome.disable();
                                this.tarefaForm.controls.responsavel_user_id.disable();
                                this.tarefaForm.controls.entrega_dt.disable();
                                this.tarefaForm.controls.limite_dt.disable();
                                this.tarefaForm.controls.descricao.disable();
                                this.tarefaForm.controls.descricao_execucao.disable();
                                this.tarefaForm.controls.tarefa_status_id.disable();
                                this.tarefaForm.controls.processo_numero.disable();
                                this.tarefaForm.controls.atividade_id.disable();
                                this.tarefaForm.controls.descricao_execucao.disable();
                                this.can_edit_executamentos = false;
                            }
                            this.data = data;
                            this.isLoading = false;
                        }
                    )
                } else {
                    this.isLoading = false;
                }
            })
    }

    setData(data: TaskDetailSave) {
        this.tarefaForm.controls['nome'].setValue(data.nome);
        this.tarefaForm.controls['descricao'].setValue(data.descricao);
        if (data.entrega_dt) {
            this.tarefaForm.controls['entrega_dt'].setValue(new Date(data.entrega_dt));
        }
        this.tarefaForm.controls['limite_dt'].setValue(new Date(data.limite_dt));
        this.tarefaForm.controls['responsavel_user_id'].setValue(data.responsavel_user_id);
        this.tarefaForm.controls['descricao_execucao'].setValue(data.descricao_execucao);
        this.tarefaForm.controls['tarefa_status_id'].setValue(data.tarefa_status_id);
        this.tarefaForm.controls['solicitante_id'].setValue(data.solicitacao_user_id);
        this.tarefaForm.controls['solicitado_em'].setValue(data.created_at);
        this.tarefaForm.controls['filial'].setValue(data.filial.nome);
        this.tarefaForm.controls['processo_numero'].setValue(data.processo_numero);
        this.tarefaForm.controls['atividade_id'].setValue(data.atividade_id);

        data.execucoes.forEach(execucao => {
            const current_user = localStorage.getItem('user_id');
            const is_solicitacao_user = data.solicitacao_user_id+'' === current_user;
            const is_responsavel_user = data.responsavel_user_id+'' === current_user;
            const is_colaborador_to_current_execucao = execucao.executante_id+'' === current_user;
            let has_permission_to_edit = (this.can_edit_executamentos || is_colaborador_to_current_execucao || is_responsavel_user || is_solicitacao_user);
            if (!has_permission_to_edit) return;
            const group = new FormGroup({
                id: new FormControl<number | null>(execucao.id),
                nome: new FormControl<string | null>({
                    value: execucao.nome,
                    disabled: !has_permission_to_edit || (is_colaborador_to_current_execucao && this.permissionService.hasPerfil(['colaboradora'])),
                }, [Validators.required]),
                executante_id: new FormControl<number | null>({
                    value: execucao.executante_id,
                    disabled: !has_permission_to_edit  || (is_colaborador_to_current_execucao && this.permissionService.hasPerfil(['colaboradora'])),
                }, [Validators.required]),
                status_id: new FormControl<number | null>({
                    value: execucao.status_id,
                    disabled: !has_permission_to_edit,
                }, [Validators.required]),
                limite_dt: new FormControl<Date | null>({
                    value: new Date(execucao.limite_dt),
                    disabled: !has_permission_to_edit  || (is_colaborador_to_current_execucao && this.permissionService.hasPerfil(['colaboradora'])),
                }, [Validators.required]),
                descricao: new FormControl<string | null>({
                    value: execucao.descricao,
                    disabled: !has_permission_to_edit,
                }),
            })

            if (this.settingsData.action === 'view') {
                group.disable();
            }

            this.tarefaForm.controls.executamentos.push(group);
        })

    }

    pickDaysEntregaDt(d: Date | null) {
        return this.pickerDays(d, this.tarefaForm.value.entrega_dt)
    }

    pickDaysLimiteDt(d: Date | null) {
        return this.pickerDays(d, this.tarefaForm.value.limite_dt)
    }

    pickerDays(d: Date | null, from: Date | null = null): boolean {
        const today = (from) ? from : new Date();

        today.setHours(0, 0, 0, 0);

        if (d) {
            return d >= today;
        } else {
            return false;
        }
    }

    addExecutamento() {
        const group = new FormGroup({
            id: new FormControl<number | null>(null),
            nome: new FormControl<string | null | undefined>(this.tarefaForm.value.descricao, [Validators.required]),
            executante_id: new FormControl<number | null>(null, [Validators.required]),
            status_id: new FormControl<number | null>(1, [Validators.required]),
            limite_dt: new FormControl<Date | null | undefined>(this.tarefaForm.value.entrega_dt, [Validators.required]),
            descricao: new FormControl<string | null | undefined>(null),
        })

        this.tarefaForm.controls.executamentos.push(group);
    }

    removeExecutamento(index: number) {
        this.tarefaForm.controls.executamentos.removeAt(index);
    }

    encerrar() {
        if (this.settingsData.action === 'view') return;
        this.saving = true;
        this.crudService
            .create(`tarefas/${this.data.id}/encerrar`, {id: 1})
            .subscribe(() => {
                this.saving = false;
                this.dialog.dialog.closeAll();
            });
    }

    save() {
        if (this.settingsData.action === 'view') return;
        this.saving = true;
        const data: TaskDetail = this.tarefaForm.value as TaskDetail;
        this.crudService
            .defaultSave('tarefas', data, this.settingsData, this.crudService, this.dialog)
            .then(() => (this.saving = false))
            .catch(() => (this.saving = false));
    }
}
