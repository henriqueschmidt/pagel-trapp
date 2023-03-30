import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {CrudTableColumnInterface} from "../../../shared/components/table/table.component";
import {AtividadeTiposCrudComponent} from "../atividade-tipos-crud/atividade-tipos-crud.component";
import {AtividadeTiposDetailsComponent} from "../atividade-tipos-details/atividade-tipos-details.component";

@Component({
  selector: 'app-atividade-tipos',
  templateUrl: './atividade-tipos.component.html',
  styleUrls: ['./atividade-tipos.component.scss']
})
export class AtividadeTiposComponent implements AfterViewInit {
    @ViewChild(AtividadeTiposCrudComponent)
    public crudComponent!: AtividadeTiposCrudComponent;

    crudContext = new Map<string, string>();

    columns: CrudTableColumnInterface[] = [
        {
            id: 'nome',
            title: 'Nome',
            value: 'nome',
        },
    ];

    manageComponent = AtividadeTiposDetailsComponent;

    constructor() {}

    ngAfterViewInit() {
        this.crudComponent.reload();
    }
}
