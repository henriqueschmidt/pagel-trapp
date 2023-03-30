import {Component, OnInit} from '@angular/core';
import {MenuService} from "../../services/menu.service";
import {Subject} from "rxjs";
import {DialogMessageService} from "../../../shared/services/dialog-message.service";

export interface MenuItem {
    path: string;
    name: string;
    rule: string;
    children?: MenuItem[];
}

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
    private isLoggedInSubject = new Subject();
    isLoggedIn = this.isLoggedInSubject.asObservable();
    isLogged = false;
    menu: MenuItem[] = []
    all_menu: MenuItem[] = [
        {
            path: '/usuarios',
            name: 'Usuários',
            rule: 'users.list'
        },
        {
            path: '/filiais',
            name: 'Filiais',
            rule: 'filiais.list'
        },
        {
            path: '/setores',
            name: 'Setores',
            rule: 'setores.list'
        },
        {
            path: '/atividades',
            name: 'Atividades',
            rule: 'atividades.list'
        },
        {
            path: '/tarefas',
            name: 'Tarefas',
            rule: 'tarefas.list'
        },
        {
            path: '/minhas-tarefas',
            name: 'Minhas tarefas',
            rule: 'tarefas.list'
        },
        {
            path: '/tarefas-concluidas',
            name: 'Tarefas concluidas',
            rule: 'tarefas.list'
        },
        {
            path: '/relatorios',
            name: 'Relatórios',
            rule: 'relatorios'
        },
    ]

    user: string | null = null;


    constructor(
        public menuService: MenuService,
        public dialogService: DialogMessageService,
    ) {}

    ngOnInit() {
        window.addEventListener('message', (event) => {
            if (typeof event.data === "string" && event.data.includes('loggedin')) {
                const data = event.data.split(':')
                this.isLoggedInSubject.next(data[1] === 'true')
            }
        });

        const token = localStorage.getItem('token');
        if (token) {
            this.menuService.checkLoggedIn().subscribe(() => {
                this.isLoggedInSubject.next(true);
            })
        }

        this.isLoggedIn.subscribe(status => {
            this.menu = [];
            this.isLogged = false;

            if (status) {
                this.isLogged = true;

                this.user = localStorage.getItem('user_name');
                if (this.user === 'undefined') this.user = null;

                const abilities_json = localStorage.getItem('abilities');
                if (abilities_json) {
                    const abilities: string[] = JSON.parse(abilities_json);
                    this.menu = this.all_menu.filter(z => abilities.includes(z.rule))
                }
            }
        })
    }

}
