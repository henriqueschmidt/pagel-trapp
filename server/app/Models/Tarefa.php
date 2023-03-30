<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use phpDocumentor\Reflection\Types\This;

class Tarefa extends Model
{
    use HasFactory;
    protected $table = 'tarefas';

    protected $fillable = [
        'id',
        'nome',
        'responsavel_user_id',
        'entrega_dt',
        'descricao',
        'tarefa_status_id',
        'descricao_execucao',
        'solicitacao_user_id',
        'filial_id',
        'atividade_id',
        'processo_numero'
    ];

    protected static function booted()
    {
        static::updating(function ($model) {
            Self::checkToFinalize($model->id, $model->getOriginal('tarefa_status_id'), $model->tarefa_status_id);

            if ($model->getOriginal('tarefa_status_id') != $model->tarefa_status_id) {
                $model->status_dt = date('Y-m-d H:m:i');

                $tarefa_status = TarefaStatus::query()->where('sistema', 'encerrada')->first();
                if ($tarefa_status->id == $model->tarefa_status_id) {
                    $model->encerramento_dt = date('Y-m-d H:m:i');
                }

            }

        });
    }

    static function checkToFinalize($id, $old_status_id, $new_status_id) {
        if ($old_status_id != $new_status_id) {
            $status = TarefaStatus::findOrFail($new_status_id);
            if ($status->sistema === 'encerrada') {
                $status_execucoes = Execucao::query()
                    ->join('tarefa_status', 'tarefa_status.id', '=', 'status_id')
                    ->where('tarefa_id', $id)
                    ->pluck('tarefa_status.sistema')
                    ->toArray();

                $aguardando_status = [
                    'aguardando',
                    'aguardando_retorno',
                    'aguardando_execucao',
                    'aguardando_revisao',
                ];

                foreach ($aguardando_status as $str) {
                    if (in_array($str, $status_execucoes)) {
                        throw new \Exception('Não é possível encerrar uma tarefa com uma execução com status "aguardando"');
                    }
                }
            }
        }
    }

    public function execucoes() {
        return $this->hasMany(Execucao::class, 'tarefa_id', 'id');
    }

    public function filial() {
        return $this->hasOne(Filial::class, 'id', 'filial_id');
    }

}
