import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CrudTableColumnInterface} from "../../../shared/components/table/table.component";
import {SetorDetailsComponent} from "../setor-details/setor-details.component";
import {SetorCrudComponent} from "../setor-crud/setor-crud.component";

@Component({
  selector: 'app-setor',
  templateUrl: './setor.component.html',
  styleUrls: ['./setor.component.scss']
})
export class SetorComponent implements AfterViewInit {
    @ViewChild(SetorCrudComponent)
    public crudComponent!: SetorCrudComponent;

    crudContext = new Map<string, string>();

    columns: CrudTableColumnInterface[] = [
        {
            id: 'nome',
            title: 'Nome',
            value: 'nome',
        },
    ];

    manageComponent = SetorDetailsComponent;

    constructor() {}

    ngAfterViewInit() {
        this.crudComponent.reload();
    }
}
