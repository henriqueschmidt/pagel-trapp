import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {CrudServiceUserService} from "../../services/crud-service-user.service";
import {CrudComponent} from "../../../shared/components/crud/crud.component";
import {PermissionsService} from "../../../auth/services/permissions.service";

@Component({
    selector: 'app-user-crud',
    templateUrl: '../../../shared/components/crud/crud.component.html',
    styleUrls: ['../../../shared/components/crud/crud.component.scss'],
})
export class UserCrudComponent extends CrudComponent<CrudServiceUserService> {
    filter: string = '';
    constructor(
        route: ActivatedRoute,
        router: Router,
        dialog: MatDialog,
        crudService: CrudServiceUserService,
        permissionsService: PermissionsService
    ) {
        super(route, router, dialog, permissionsService);
        this.setCrudService(crudService);
    }
}
