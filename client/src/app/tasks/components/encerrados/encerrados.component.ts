import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {TasksCrudComponent} from "../tasks-crud/tasks-crud.component";
import {CrudTableColumnInterface} from "../../../shared/components/table/table.component";
import {TasksDetailComponent} from "../tasks-detail/tasks-detail.component";
import {PermissionsService} from "../../../auth/services/permissions.service";

@Component({
  selector: 'app-encerrados',
  templateUrl: './encerrados.component.html',
  styleUrls: ['./encerrados.component.scss']
})
export class EncerradosComponent implements AfterViewInit {
    @ViewChild(TasksCrudComponent)
    public crudComponent!: TasksCrudComponent;

    crudContext = new Map<string, string>();

    columns: CrudTableColumnInterface[] = [
        {
            id: 'id',
            title: 'ID',
            value: 'id',
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
