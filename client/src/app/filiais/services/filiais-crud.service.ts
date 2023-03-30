import {Injectable} from '@angular/core';
import {BaseCrudService} from "../../shared/services/crud-service-base.service";
import {BaseServiceService} from "../../shared/services/base-service.service";

export interface FilialDetail {
    id: number;
    nome: string;
    telefone: string;
    endereco: string;
}

export interface FilialGridItem {
    id: number;
    nome: string;
    telefone: string;
    endereco: string;
}

@Injectable({
  providedIn: 'root'
})
export class FiliaisCrudService extends BaseCrudService<FilialDetail, FilialGridItem> {
    constructor(public service: BaseServiceService) {
        super(service);
    }
}
