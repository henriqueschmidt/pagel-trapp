<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AtividadeTipos extends Model
{
    use HasFactory;

    protected $table = 'atividade_tipos';
    protected $fillable = [
        'nome',
    ];
}
