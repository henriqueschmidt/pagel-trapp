import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CrudTableColumnInterface} from "../../../shared/components/table/table.component";
import {FiliaisDetailsComponent} from "../filiais-details/filiais-details.component";
import {FiliaisCrudComponent} from "../filiais-crud/filiais-crud.component";

@Component({
  selector: 'app-filiais',
  templateUrl: './filiais.component.html',
  styleUrls: ['./filiais.component.scss']
})
export class FiliaisComponent implements AfterViewInit {
    @ViewChild(FiliaisCrudComponent)
    public crudComponent!: FiliaisCrudComponent;

    crudContext = new Map<string, string>();

    columns: CrudTableColumnInterface[] = [
        {
            id: 'nome',
            title: 'Nome',
            value: 'nome',
        },
        {
            id: 'telefone',
            title: 'Telefone',
            value: 'telefone',
        },
        {
            id: 'endereco',
            title: 'Endereço',
            value: 'endereco',
        },
    ];

    manageComponent = FiliaisDetailsComponent;
    constructor() {}

    ngAfterViewInit() {
        this.crudComponent.reload();
    }

}
