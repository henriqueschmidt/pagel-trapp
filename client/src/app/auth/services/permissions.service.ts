import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PermissionsService {
    perfil!: string;
    permissoes!: string[];

    constructor() {
        this.start();
    }

    start() {
        const perfil = localStorage.getItem('perfil');
        if (perfil) {
            this.perfil = perfil;
        }

        const abilities = localStorage.getItem('abilities');
        if (abilities) {
            this.permissoes = JSON.parse(abilities);
        }
    }

    hasPerfil(perfil: string | string[]) {
        if (!this.perfil) return false;
        if (typeof perfil === "string") {
            return this.perfil === perfil
        } else {
            return perfil.includes(this.perfil);
        }
    }

    hasPermissao(permissao: string) {
        if (!this.permissoes) return false;
        return this.permissoes.includes(permissao);
    }

}
