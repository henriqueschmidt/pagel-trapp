import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {CrudComponent} from "../../../shared/components/crud/crud.component";
import {FiliaisCrudService} from "../../services/filiais-crud.service";
import {PermissionsService} from "../../../auth/services/permissions.service";

@Component({
    selector: 'app-filiais-crud',
    templateUrl: '../../../shared/components/crud/crud.component.html',
    styleUrls: ['../../../shared/components/crud/crud.component.scss'],
})
export class FiliaisCrudComponent extends CrudComponent<FiliaisCrudService> {
    filter: string = '';
    constructor(
        route: ActivatedRoute,
        router: Router,
        dialog: MatDialog,
        crudService: FiliaisCrudService,
        permissionsService: PermissionsService
    ) {
        super(route, router, dialog, permissionsService);
        this.setCrudService(crudService);
    }
}
