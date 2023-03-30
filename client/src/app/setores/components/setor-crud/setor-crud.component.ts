import {Component} from '@angular/core';
import {CrudComponent} from "../../../shared/components/crud/crud.component";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {SetorCrudService} from "../../services/setor-crud.service";
import {PermissionsService} from "../../../auth/services/permissions.service";

@Component({
    selector: 'app-setor-crud',
    templateUrl: '../../../shared/components/crud/crud.component.html',
    styleUrls: ['../../../shared/components/crud/crud.component.scss'],
})
export class SetorCrudComponent extends CrudComponent<SetorCrudService> {
    filter: string = '';
    constructor(
        route: ActivatedRoute,
        router: Router,
        dialog: MatDialog,
        crudService: SetorCrudService,
        permissionsService: PermissionsService
    ) {
        super(route, router, dialog, permissionsService);
        this.setCrudService(crudService);
    }
}
