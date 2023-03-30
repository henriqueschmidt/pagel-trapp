import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {TasksCrudComponent} from "../tasks-crud/tasks-crud.component";
import {CrudTableColumnInterface} from "../../../shared/components/table/table.component";
import {TasksDetailComponent} from "../tasks-detail/tasks-detail.component";
import {PermissionsService} from "../../../auth/services/permissions.service";

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss']
})
export class MyTasksComponent  implements AfterViewInit {
    @ViewChild(TasksCrudComponent)
    public crudComponent!: TasksCrudComponent;

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
        public permissionService: PermissionsService
    ) {
        permissionService.start()
    }

    ngAfterViewInit() {
        this.crudComponent.reload();
    }

}
