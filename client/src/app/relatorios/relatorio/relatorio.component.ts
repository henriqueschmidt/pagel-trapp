import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {forkJoin} from "rxjs";
import {SelectOption} from "../../tasks/components/tasks-detail/tasks-detail.component";
import {SetorCrudService} from "../../setores/services/setor-crud.service";
import {DialogMessageService} from "../../shared/services/dialog-message.service";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// @ts-ignore
import * as pdfMake from "pdfmake/build/pdfmake";
// @ts-ignore
import * as pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


export interface RelatorioData {
    id: number;
    count: {
        criadas: number;
        em_aberto: number;
        concluidas: number;
    };
    details: {
        [key:string]: {
            concluidas: number;
            em_aberto: number;
            novas: number;
            total: number;
            atividades?: {
                concluidas: number;
                em_aberto: number;
                novas: number;
                total: number;
            }[];
        }[]
    };
}

@Component({
    selector: 'app-relatorio',
    templateUrl: './relatorio.component.html',
    styleUrls: ['./relatorio.component.scss']
})
export class RelatorioComponent implements OnInit {
    isLoading: boolean = true;
    saving: boolean = false;

    @ViewChild('relatorioData')
    pdfTable!: ElementRef;

    usuarios: SelectOption[] = [];
    todos_usuarios: SelectOption[] = [];
    filiais: SelectOption[] = [];
    atividades: SelectOption[] = [];

    data: RelatorioData | null = null;

    equipe: number[] = [];
    filial: number[] = [];
    atividade: number[] = [];
    data_inicial: string = '';
    data_final: string = '';
    relatorio: string = '';
    relatorios: { nome: string; sistema: string; }[] = [
        { nome: 'Filial', sistema: 'filial' },
        { nome: 'Executante', sistema: 'executante' },
        { nome: 'Coordenadora', sistema: 'coordenadora' },
        { nome: 'Setor', sistema: 'setor' },
    ];
    table_data: any[] = [];

    constructor(private crudService: SetorCrudService, private dialogMessage: DialogMessageService) {}

    ngOnInit() {
        forkJoin({
            usuarios: this.crudService.listSelectOptions('relatorios', '/usuarios'),
            filiais: this.crudService.listSelectOptions('relatorios', '/filiais'),
            atividades: this.crudService.listSelectOptions('relatorios', '/atividades'),
        }).subscribe(
            responses => {
                this.atividades = responses.atividades.data as unknown as SelectOption[];
                this.filiais = responses.filiais.data as unknown as SelectOption[];
                this.usuarios = responses.usuarios.data as unknown as SelectOption[];
                this.todos_usuarios = responses.usuarios.data as unknown as SelectOption[];

                this.isLoading = false;
            }
        )
    }

    generatePreview() {

        let url = '/gerar';

        const data_inicial = this.data_inicial as unknown as Date;
        const data_final = this.data_final as unknown as Date;

        if (!data_inicial || !data_final) {
            this.dialogMessage.error('É necessário informar o período')
            return;
        }

        url += `?first_date=${data_inicial.toDateString()}`;
        url += `&second_date=${data_final.toDateString()}`;
        url += `&equipe=${JSON.stringify(this.equipe)}`;
        url += `&atividade=${JSON.stringify(this.atividade)}`;
        url += `&relatorio=${this.relatorio}`;
        if (this.filial.length > 0) {
            url += `&filial=${JSON.stringify(this.filial)}`;
        }

        this.crudService.listSelectOptions('relatorios', url).subscribe(
            (response) => {
                this.data = response.data as unknown as RelatorioData;
                const table_data: any[] = [];
                if (this.data) {
                    if (this.relatorio == 'filial') {
                        Object.keys(this.data.details).forEach(z => {
                            // @ts-ignore
                            table_data.push({ nome: z, ...this.data.details[z] })
                        })
                    }
                    if (this.relatorio == 'setor') {
                        Object.keys(this.data.details).forEach(z => {
                            // @ts-ignore
                            table_data.push({ nome: z, ...this.data.details[z] })
                        })
                    }
                    if (this.relatorio == 'executante' || this.relatorio == 'coordenadora') {
                        console.log(this.data.details)
                        Object.keys(this.data.details).forEach(z => {
                            // @ts-ignore
                            table_data.push({ user_name_display: this.data.details[z]['user_name'], ...this.data.details[z], atividade: '' });
                            // @ts-ignore
                            Object.keys(this.data.details[z]['atividades']).forEach(x => {
                                // @ts-ignore
                                table_data.push({ user_name: '', user_name_display: this.data.details[z]['user_name'], atividade: x, ...this.data.details[z]['atividades'][x] })
                            })
                        })
                    }
                }
                this.table_data = table_data;
            }
        )
    }

    generatePdf() {
        const pdfTable = this.pdfTable.nativeElement;
        let html_string = pdfTable.innerHTML;
        html_string = html_string.replace(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g, '<span').replace('</a>', '</span>')
        var html = htmlToPdfmake(html_string);
        const documentDefinition = { content: html };
        pdfMake.createPdf(documentDefinition).download();
    }

    onRelatorioChange(newValue: any) {
        this.equipe = [];
        this.filial = [];
        this.atividade = [];
        if (newValue === 'coordenadora') {
            this.usuarios = this.todos_usuarios.filter(z => z.perfil == newValue);
        } else {
            this.usuarios = this.todos_usuarios;
        }
        this.data = null;
    }
}
