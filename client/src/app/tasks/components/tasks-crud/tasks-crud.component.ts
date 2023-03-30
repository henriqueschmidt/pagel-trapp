import {Component} from '@angular/core';
import {CrudComponent} from "../../../shared/components/crud/crud.component";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {TaskCrudService} from "../../services/task-crud.service";
import {PermissionsService} from "../../../auth/services/permissions.service";

@Component({
    selector: 'app-tasks-crud',
    templateUrl: '../../../shared/components/crud/crud.component.html',
    styleUrls: ['../../../shared/components/crud/crud.component.scss'],
})
export class TasksCrudComponent extends CrudComponent<TaskCrudService> {
    filter: string = '';
    constructor(
        route: ActivatedRoute,
        router: Router,
        dialog: MatDialog,
        crudService: TaskCrudService,
        permissionsService: PermissionsService
    ) {
        super(route, router, dialog, permissionsService);
        this.setCrudService(crudService);
    }
}
