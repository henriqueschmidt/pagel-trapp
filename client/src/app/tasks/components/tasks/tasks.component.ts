import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CrudTableColumnInterface} from "../../../shared/components/table/table.component";
import {TasksDetailComponent} from "../tasks-detail/tasks-detail.component";
import {TasksCrudComponent} from "../tasks-crud/tasks-crud.component";
import {PermissionsService} from "../../../auth/services/permissions.service";
import {last} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, AfterViewInit {
    @ViewChild(TasksCrudComponent)
    public crudComponent!: TasksCrudComponent;
    custom_params: { key: string; value: any }[] = [];
    crudContext = new Map<string, string>();

    columns: CrudTableColumnInterface[] = [
        {
            id: 'id',
            title: 'ID',
            value: 'id',
            classFunction: (data: any) => {
                if (data.status === 'Em andamento') return 'em-andamento';
                if (data.status === 'Cancelada') return 'cancelada';
                if (data.status === 'Encerrada') return 'encerrada';
                return 'aguardando';
            }
        },
        {
            id: 'created_at',
            title: 'Solicitado em',
            value: 'created_at',
        },
        {
            id: 'nome',
            title: 'Nome Cliente',
            value: 'nome',
            class: 'nome-cliente-column',
        },
        {
            id: 'status',
            title: 'Status',
            value: 'status',
        },
        {
            id: 'executantes',
            title: 'Executantes',
            value: 'executantes',
        },
        {
            id: 'processo_numero',
            title: 'Nº processo',
            value: 'processo_numero',
        },
        {
            id: 'atividade',
            title: 'Atividade',
            value: 'atividade',
        },
        {
            id: 'entrega_dt',
            title: 'Prazo ED',
            value: 'entrega_dt',
        },
        {
            id: 'limite_dt',
            title: 'Prazo fatal',
            value: 'limite_dt',
            classFunction: (data: any) => {
                const date = new Date(data.limite_dt);

                const dateInPast = (date: Date) => {
                    if (date.setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)) {
                        return true;
                    }
                    return false;
                }
                const isToday = (date: Date) => {
                    const today = new Date();
                    return today.toDateString() === date.toDateString();
                }
                const isYesterday = (date: Date) => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    return yesterday.toDateString() === date.toDateString();
                }
                const isLast2Days = (date: Date) => {
                    const last_two_days = new Date();
                    last_two_days.setDate(last_two_days.getDate() - 2);
                    return last_two_days.toDateString() === date.toDateString();
                }
                if (['Cancelada', 'Encerrada'].includes(data.status)) return '';

                if (isLast2Days(new Date(data.limite_dt))) return 'em-andamento';
                if (isYesterday(new Date(data.limite_dt)) || isToday(new Date(data.limite_dt))) return 'cancelada';
                return 'aguardando';
            }
        },
        {
            id: 'user_coordenadora',
            title: 'Coordenadora',
            value: 'user_coordenadora',
        },
        {
            id: 'user_solicitacao',
            title: 'Solicitado por',
            value: 'user_solicitacao',
        },
    ];

    manageComponent = TasksDetailComponent;
    constructor(
        public permissionService: PermissionsService,
        private route: ActivatedRoute,
    ) {
        permissionService.start()
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['relatorio_id']) {
                this.custom_params.push({ key: 'relatorio_id', value: params['relatorio_id'] });
            }
            if (params['setor']) {
                this.custom_params.push({ key: 'setor_name', value: params['setor'] });
            }
            if (params['atividade_name']) {
                this.custom_params.push({ key: 'atividade_name', value: params['atividade_name'] });
            }
            if (params['todas']) {
                this.custom_params.push({ key: 'all', value: 'true' });
            }
            if (params['novas']) {
                this.custom_params.push({ key: 'new', value: 'true' });
            }
            if (params['em_andamento']) {
                this.custom_params.push({ key: 'running', value: 'true' });
            }
            if (params['concluidas']) {
                this.custom_params.push({ key: 'finish', value: 'true' });
            }
            if (params['coordenadora']) {
                this.custom_params.push({ key: 'coordenadora', value: params['coordenadora'] });
            }
            if (params['executante']) {
                this.custom_params.push({ key: 'executante', value: params['executante'] });
            }
        })
    }

    ngAfterViewInit() {
        this.crudComponent.reload();
    }

}
