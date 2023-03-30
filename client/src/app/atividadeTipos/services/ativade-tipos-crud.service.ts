import { Injectable } from '@angular/core';
import {BaseCrudService} from "../../shared/services/crud-service-base.service";
import {BaseServiceService} from "../../shared/services/base-service.service";

export interface AtividadeTiposDetail {
    id: number;
    nome: string;
}

export interface AtividadeTiposGridItem {
    id: number;
    nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class AtivadeTiposCrudService extends BaseCrudService<AtividadeTiposDetail, AtividadeTiposGridItem> {
    constructor(public service: BaseServiceService) {
        super(service);
    }
}
