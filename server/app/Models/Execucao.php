<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Execucao extends Model
{
    use HasFactory;
    protected $table = 'execucoes';

    protected $fillable = [
        'nome',
        'descricao',
        'limite_dt',
        'status_id',
        'executante_id',
        'tarefa_id',
    ];

    protected static function booted()
    {
        static::updating(function ($model) {
            Self::changeTaskStatus($model, $model->getOriginal('status_id'), $model->status_id);
        });
    }

    static function changeTaskStatus($model, $old_status_id, $new_status_id) {
        if ($old_status_id != $new_status_id) {

            $old_status = TarefaStatus::query()->findOrFail($old_status_id);
            $new_status = TarefaStatus::query()->findOrFail($new_status_id);
            if ($old_status->sistema == 'aguardando') {
                $task = Tarefa::query()->findOrFail($model->tarefa_id);
                $new_tarefa_status = TarefaStatus::query()->where('sistema', 'andamento')->first();
                $task->tarefa_status_id = $new_tarefa_status->id;
                $task->save();
            }

            if ($new_status->sistema == 'encerrada') {
                $execucoes = Execucao::query()
                    ->where('tarefa_id', $model->tarefa_id)
                    ->where('id', '!=', $model->id)
                    ->get();
                $all_executed = true;
                foreach ($execucoes as $execucoe) {
                    if ($execucoe->status_id != $new_status_id) {
                        $all_executed = false;
                    }
                }
                if ($all_executed) {
                    $task = Tarefa::query()->findOrFail($model->tarefa_id);
                    $new_tarefa_status = TarefaStatus::query()->where('sistema', 'aguardando_revisao')->first();
                    $task->tarefa_status_id = $new_tarefa_status->id;
                    $task->save();
                }
            }

        }
    }
}
