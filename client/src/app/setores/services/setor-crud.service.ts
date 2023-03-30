import {Injectable} from '@angular/core';
import {BaseCrudService} from "../../shared/services/crud-service-base.service";
import {BaseServiceService} from "../../shared/services/base-service.service";

export interface SetorDetail {
    id: number;
    nome: string;
}

export interface SetorGridItem {
    id: number;
    nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class SetorCrudService extends BaseCrudService<SetorDetail, SetorGridItem> {
    constructor(public service: BaseServiceService) {
        super(service);
    }
}
