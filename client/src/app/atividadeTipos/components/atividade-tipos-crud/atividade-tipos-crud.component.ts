import {Component} from '@angular/core';
import {CrudComponent} from "../../../shared/components/crud/crud.component";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AtivadeTiposCrudService} from "../../services/ativade-tipos-crud.service";
import {PermissionsService} from "../../../auth/services/permissions.service";

@Component({
    selector: 'app-atividade-tipos-crud',
    templateUrl: '../../../shared/components/crud/crud.component.html',
    styleUrls: ['../../../shared/components/crud/crud.component.scss'],
})
export class AtividadeTiposCrudComponent extends CrudComponent<AtivadeTiposCrudService> {
    filter: string = '';
    constructor(
        route: ActivatedRoute,
        router: Router,
        dialog: MatDialog,
        crudService: AtivadeTiposCrudService,
        permissionsService: PermissionsService
    ) {
        super(route, router, dialog, permissionsService);
        this.setCrudService(crudService);
    }
}
