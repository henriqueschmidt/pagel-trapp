import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {UserCrudComponent} from "../user-crud/user-crud.component";
import {CrudTableColumnInterface} from "../../../shared/components/table/table.component";
import {UserDetailComponent} from "../user-detail/user-detail.component";

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements AfterViewInit {
    @ViewChild(UserCrudComponent)
    public crudComponent!: UserCrudComponent;

    crudContext = new Map<string, string>();

    columns: CrudTableColumnInterface[] = [
        {
            id: 'name',
            title: 'Nome',
            value: 'name',
        },
        {
            id: 'email',
            title: 'Email',
            value: 'email',
        },
        {
            id: 'perfil',
            title: 'Perfil',
            value: 'perfil',
        },
        {
            id: 'setor',
            title: 'Setor',
            value: 'setor',
        },
        {
            id: 'filial',
            title: 'Filial',
            value: 'filial',
        },
    ];

    manageComponent = UserDetailComponent;
    constructor() {}

    ngAfterViewInit() {
        this.crudComponent.reload();
    }

}
