<?php

namespace App\Http\Controllers;

use App\Models\AtividadeTipos;
use App\Models\Execucao;
use App\Models\Relatorio;
use App\Models\Tarefa;
use App\Models\TarefaStatus;
use App\Models\User;
use App\Repositories\CommonRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Exception;

class TarefaController extends Controller
{

    protected CommonRepository $commonRepository;

    public function __construct(CommonRepository $commonRepository)
    {
        $this->commonRepository = $commonRepository;
    }

    public function index(Request $request)
    {
        try {
            $columns = [
                'id' => 'tarefas.id',
                'created_at' => 'tarefas.created_at',
                'nome' => 'tarefas.nome',
                'entrega_dt' => 'entrega_dt',
                'limite_dt' => 'limite_dt',
                'user_solicitacao' => 'solicitacao.name',
                'user_coordenadora' => 'coordenadora.name',
                'status' => 'ts.nome',
                'processo_numero' => 'processo_numero',
                'atividade' => 'at.nome',
                'execucoes' => 'tarefas.id'
            ];

            $executantes_sql = <<<eot
                (
                    select
                        group_concat(name SEPARATOR ", ") as executantes
                    from users
                    inner join execucoes on execucoes.executante_id = users.id
                    where execucoes.tarefa_id = tarefas.id
                ) as executantes
            eot;

            if ($request->has('relatorio_id') && !empty(($request->get('relatorio_id')))) {
                $data = $this->tarefasRelatorios($request, $executantes_sql, $columns);
                return response()->json($data, 200);
            }

            $user = Auth::user();
            $query = Tarefa::query()
                ->join('tarefa_status as ts', 'ts.id', '=', 'tarefas.tarefa_status_id')
                ->join('users as coordenadora', 'coordenadora.id', '=', 'tarefas.responsavel_user_id')
                ->join('users as solicitacao', 'solicitacao.id', '=', 'tarefas.solicitacao_user_id')
                ->leftJoin('atividade_tipos as at', 'at.id', '=', 'tarefas.atividade_id')
                ->when($user->hasPerfil(['coordenadora']), function ($q) use ($user) {
                    $q->where(function ($q2) use ($user) {
                        $q2->where('responsavel_user_id', $user->id);
                        $q2->orWhere('solicitacao_user_id', $user->id);
                        $q2->orWhereHas('execucoes', function ($q2) use ($user) {
                            $q2->where('executante_id', $user->id);
                        });
                    });
                })
                ->when($user->hasPerfil(['colaboradora']), function ($q) use ($user) {
                    $q->whereHas('execucoes', function ($q2) use ($user) {
                        $q2->where('executante_id', $user->id);
                    });
                })
                ->when($request->has('coordenadoras'), function ($q) use ($request) {
                    $q->whereIn('coordenadora.id', json_decode($request->get('coordenadoras')));
                })
                ->when($request->has('prazo'), function ($q) use ($request) {
                    $q->where(function ($q2) use ($request) {
                        $q2->whereDate('limite_dt', new Carbon($request->get('prazo')));
                        $q2->orWhereDate('entrega_dt', new Carbon($request->get('prazo')));
                    });
                })
                ->when($request->has('solicitado'), function ($q) use ($request) {
                    $q->whereDate('tarefas.created_at', new Carbon($request->get('solicitado')));
                })
                ->when($request->has('status_filter'), function ($q) use ($request) {
                    $q->whereIn('ts.id', json_decode($request->get('status_filter')));
                })
                ->when($request->has('atividade_filter'), function ($q) use ($request) {
                    $q->whereIn('at.id', json_decode($request->get('atividade_filter')));
                })
                ->when($request->has('solicitacao_filter'), function ($q) use ($request) {
                    $q->whereIn('solicitacao.id', json_decode($request->get('solicitacao_filter')));
                })
                ->when($request->has('executantes'), function ($q) use ($request) {
                    $q->whereHas('execucoes', function ($q2) use ($request) {
                        $q2->whereIn('executante_id', json_decode($request->get('executantes')));
                    });
                })
                ->whereNot('ts.sistema', 'encerrada')
                ->select(
                    'tarefas.id',
                    'tarefas.created_at',
                    'tarefas.nome',
                    'at.nome as atividade',
                    'entrega_dt',
                    'limite_dt',
                    'solicitacao.name as user_solicitacao',
                    'coordenadora.name as user_coordenadora',
                    'ts.nome as status',
                    'processo_numero',
                    DB::raw($executantes_sql)
                );

            $data = $this->commonRepository->datatablesServerSide($request->all(), $columns, $query);

            $data['custom_filters'] = [
                'executantes' => [],
                'status' => [],
                'solicitado' => [],
                'coordenadora' => [],
                'atividade' => [],
            ];

            $query_f = Tarefa::query()
                ->join('tarefa_status as ts', 'ts.id', '=', 'tarefas.tarefa_status_id')
                ->join('atividade_tipos as at', 'at.id', '=', 'tarefas.atividade_id')
                ->join('users as coordenadora', 'coordenadora.id', '=', 'tarefas.responsavel_user_id')
                ->join('users as solicitacao', 'solicitacao.id', '=', 'tarefas.solicitacao_user_id')
                ->when($user->hasPerfil(['coordenadora']), function ($q) use ($user) {
                    $q->where(function ($q2) use ($user) {
                        $q2->where('responsavel_user_id', $user->id);
                        $q2->orWhere('solicitacao_user_id', $user->id);
                    });
                })
                ->when($user->hasPerfil(['colaboradora']), function ($q) use ($user) {
                    $q->whereHas('execucoes', function ($q2) use ($user) {
                        $q2->where('executante_id', $user->id);
                    });
                })
                ->whereNot('ts.sistema', 'encerrada')
                ->select(
                    'tarefas.id',
                    'tarefas.created_at',
                    'tarefas.nome',
                    'entrega_dt',
                    'limite_dt',
                    'solicitacao.name as user_solicitacao',
                    'coordenadora.name as user_coordenadora',
                    'solicitacao.id as user_solicitacao_id',
                    'coordenadora.id as user_coordenadora_id',
                    'ts.nome as status',
                    'ts.id as status_id',
                    'at.id as atividade_id',
                    'at.nome as atividade_name'
                )
                ->get()
                ->toArray();

            foreach ($query_f as $item) {
                $array_values = array_values($data['custom_filters']['coordenadora']);
                $value = [
                    'id' => $item['user_coordenadora_id'],
                    'name' => $item['user_coordenadora'],
                ];
                if (!in_array($value, $array_values)) {
                    $data['custom_filters']['coordenadora'][] = $value;
                }

                $array_values = array_values($data['custom_filters']['solicitado']);
                $value = [
                    'id' => $item['user_solicitacao_id'],
                    'name' => $item['user_solicitacao'],
                ];
                if (!in_array($value, $array_values)) {
                    $data['custom_filters']['solicitado'][] = $value;
                }

                $array_values = array_values($data['custom_filters']['status']);
                $value = [
                    'id' => $item['status_id'],
                    'name' => $item['status'],
                ];
                if (!in_array($value, $array_values)) {
                    $data['custom_filters']['status'][] = $value;
                }

                $array_values = array_values($data['custom_filters']['atividade']);
                $value = [
                    'id' => $item['atividade_id'],
                    'name' => $item['atividade_name'],
                ];
                if (!in_array($value, $array_values)) {
                    $data['custom_filters']['atividade'][] = $value;
                }

                $execucoes = Execucao::query()
                    ->join('users', 'users.id', '=', 'execucoes.executante_id')
                    ->where('tarefa_id', $item['id'])
                    ->select('executante_id', 'users.name')
                    ->get();

                foreach ($execucoes as $execucao) {
                    $value = [
                        'id' => $execucao->executante_id,
                        'name' => $execucao->name,
                    ];
                    if (!in_array($value, $data['custom_filters']['executantes'])) {
                        $data['custom_filters']['executantes'][] = $value;
                    }
                }

            }
            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    private function relatorioGetTarefas($ids, $executantes_sql) {
        $tarefas = Tarefa::query()
            ->join('tarefa_status as ts', 'ts.id', '=', 'tarefas.tarefa_status_id')
            ->join('users as coordenadora', 'coordenadora.id', '=', 'tarefas.responsavel_user_id')
            ->join('users as solicitacao', 'solicitacao.id', '=', 'tarefas.solicitacao_user_id')
            ->leftJoin('atividade_tipos as at', 'at.id', '=', 'tarefas.atividade_id')
            ->whereIn('tarefas.id', $ids)
            ->select(
                'tarefas.id',
                'tarefas.created_at',
                'tarefas.nome',
                'at.nome as atividade',
                'entrega_dt',
                'encerramento_dt',
                'limite_dt',
                'solicitacao.name as user_solicitacao',
                'coordenadora.name as user_coordenadora',
                'ts.nome as status',
                'processo_numero',
                DB::raw($executantes_sql)
            )
            ->get()
            ->toArray();

            foreach (array_count_values($ids) as $task_id => $task_count) {
            if ($task_count == 1) continue;
            for ($i = 1; $i < $task_count; $i++) { 
                $tarefas[] = Tarefa::query()
                    ->join('tarefa_status as ts', 'ts.id', '=', 'tarefas.tarefa_status_id')
                    ->join('users as coordenadora', 'coordenadora.id', '=', 'tarefas.responsavel_user_id')
                    ->join('users as solicitacao', 'solicitacao.id', '=', 'tarefas.solicitacao_user_id')
                    ->leftJoin('atividade_tipos as at', 'at.id', '=', 'tarefas.atividade_id')
                    ->where('tarefas.id', $task_id)
                    ->select(
                        'tarefas.id',
                        'tarefas.created_at',
                        'tarefas.nome',
                        'at.nome as atividade',
                        'entrega_dt',
                        'encerramento_dt',
                        'limite_dt',
                        'solicitacao.name as user_solicitacao',
                        'coordenadora.name as user_coordenadora',
                        'ts.nome as status',
                        'processo_numero',
                        DB::raw($executantes_sql)
                    )
                    ->first()
                    ->toArray();
            }
        }
        return $tarefas;
    }

    private function tarefasRelatorios($request, $executantes_sql, $columns): array
    {
        $relatorio = Relatorio::query()->findOrFail($request->get('relatorio_id'));

        $ids = [];
        if ($request->has('all')) {
            $ids = json_decode($relatorio->tarefa_ids) ?? [];
        }
        
        if ($request->has('new')) {
            $ids = json_decode($relatorio->tarefas_novas_ids) ?? [];
        }

        if ($request->has('running')) {
            $ids = json_decode($relatorio->tarefas_em_andamento_ids) ?? [];
        }

        if ($request->has('finish')) {
            $ids = json_decode($relatorio->tarefa_concluidas_ids) ?? [];
        }

        $tarefas = collect($this->relatorioGetTarefas($ids, $executantes_sql));
        
        if ($request->has('atividade_name')) {
            $atividade_name = $request->get('atividade_name');
            $tarefas = $tarefas->filter(function ($item) use($atividade_name) {
                if ($atividade_name == $item['atividade']) {
                    return $item;
                }
            });
        }

        if ($request->has('coordenadora')) {
            $coordenadora = $request->get('coordenadora');
            $tarefas = $tarefas->filter(function ($item) use($coordenadora) {
                if ($coordenadora == $item['user_coordenadora']) {
                    return $item;
                }
            });
        }

        if ($request->has('executante')) {
            $executante = $request->get('executante');
            $tarefas = $tarefas->filter(function ($item) use($executante) {
                if (str_contains($item['executantes'], $executante)) {
                    return $item;
                }
            });
        }

        if ($request->has('sort')) {
            $sort = $request->get('sort');
            $sort = explode(',', $sort);
            $tarefas = $tarefas->sortBy([
                [$sort[0], $sort[1] ?? 'asc'],
            ]);
        } else {
            $tarefas = $tarefas->sortBy([
                ['id', 'asc'],
            ]);
        }

        return [
            "draw" => 0,
            "data" => $tarefas->values()->all(),
            "elementsFiltered" => count($tarefas->values()->all()),
            "totalElements" => count($tarefas->values()->all()),
            "success" => true,
        ];
    }

    public function encerrados(Request $request)
    {
        try {

            $executantes_sql = <<<eot
                (
                    select
                        group_concat(name SEPARATOR ", ") as executantes
                    from users
                    inner join execucoes on execucoes.executante_id = users.id
                    where execucoes.tarefa_id = tarefas.id
                ) as executantes
            eot;

            $user = Auth::user();
            $query = Tarefa::query()
                ->join('tarefa_status as ts', 'ts.id', '=', 'tarefas.tarefa_status_id')
                ->join('users as coordenadora', 'coordenadora.id', '=', 'tarefas.responsavel_user_id')
                ->join('users as solicitacao', 'solicitacao.id', '=', 'tarefas.solicitacao_user_id')
                ->leftJoin('atividade_tipos as at', 'at.id', '=', 'tarefas.atividade_id')
                ->when($user->hasPerfil(['coordenadora']), function ($q) use ($user) {
                    $q->where(function ($q2) use ($user) {
                        $q2->where('responsavel_user_id', $user->id);
                        $q2->orWhere('solicitacao_user_id', $user->id);
                        $q2->orWhereHas('execucoes', function ($q2) use ($user) {
                            $q2->where('executante_id', $user->id);
                        });
                    });
                })
                ->when($user->hasPerfil(['colaboradora']), function ($q) use ($user) {
                    $q->whereHas('execucoes', function ($q2) use ($user) {
                        $q2->where('executante_id', $user->id);
                    });
                })
                ->when($request->has('coordenadoras'), function ($q) use ($request) {
                    $q->whereIn('coordenadora.id', json_decode($request->get('coordenadoras')));
                })
                ->when($request->has('prazo'), function ($q) use ($request) {
                    $q->where(function ($q2) use ($request) {
                        $q2->whereDate('limite_dt', new Carbon($request->get('prazo')));
                        $q2->orWhereDate('entrega_dt', new Carbon($request->get('prazo')));
                    });
                })
                ->when($request->has('solicitado'), function ($q) use ($request) {
                    $q->whereDate('tarefas.created_at', new Carbon($request->get('solicitado')));
                })
                ->when($request->has('solicitacao_filter'), function ($q) use ($request) {
                    $q->whereIn('solicitacao.id', json_decode($request->get('solicitacao_filter')));
                })
                ->when($request->has('executantes'), function ($q) use ($request) {
                    $q->whereHas('execucoes', function ($q2) use ($request) {
                        $q2->whereIn('executante_id', json_decode($request->get('executantes')));
                    });
                })
                ->when($request->has('atividade_filter'), function ($q) use ($request) {
                    $q->whereIn('at.id', json_decode($request->get('atividade_filter')));
                })
                ->where('ts.sistema', 'encerrada')
                ->select(
                    'tarefas.id',
                    'tarefas.created_at',
                    'tarefas.nome',
                    'at.nome as atividade',
                    'entrega_dt',
                    'limite_dt',
                    'solicitacao.name as user_solicitacao',
                    'coordenadora.name as user_coordenadora',
                    'ts.nome as status',
                    'processo_numero',
                    DB::raw($executantes_sql)
                );

            $columns = [
                'id' => 'tarefas.id',
                'created_at' => 'tarefas.created_at',
                'nome' => 'tarefas.nome',
                'entrega_dt' => 'entrega_dt',
                'limite_dt' => 'limite_dt',
                'user_solicitacao' => 'solicitacao.name',
                'user_coordenadora' => 'coordenadora.name',
                'status' => 'ts.nome',
                'processo_numero' => 'processo_numero',
                'atividade' => 'at.nome',
                'execucoes' => 'tarefas.id'
            ];

            $data = $this->commonRepository->datatablesServerSide($request->all(), $columns, $query);

            $data['custom_filters'] = [
                'executantes' => [],
                'status' => [],
                'solicitado' => [],
                'coordenadora' => [],
                'atividade' => [],
            ];

            $query_f = Tarefa::query()
                ->join('tarefa_status as ts', 'ts.id', '=', 'tarefas.tarefa_status_id')
                ->join('atividade_tipos as at', 'at.id', '=', 'tarefas.atividade_id')
                ->join('users as coordenadora', 'coordenadora.id', '=', 'tarefas.responsavel_user_id')
                ->join('users as solicitacao', 'solicitacao.id', '=', 'tarefas.solicitacao_user_id')
                ->when($user->hasPerfil(['coordenadora']), function ($q) use ($user) {
                    $q->where(function ($q2) use ($user) {
                        $q2->where('responsavel_user_id', $user->id);
                        $q2->orWhere('solicitacao_user_id', $user->id);
                    });
                })
                ->when($user->hasPerfil(['colaboradora']), function ($q) use ($user) {
                    $q->whereHas('execucoes', function ($q2) use ($user) {
                        $q2->where('executante_id', $user->id);
                    });
                })
                ->when($request->has('atividade_filter'), function ($q) use ($request) {
                    $q->whereIn('at.id', json_decode($request->get('atividade_filter')));
                })
                ->where('ts.sistema', 'encerrada')
                ->select(
                    'tarefas.id',
                    'tarefas.nome',
                    'entrega_dt',
                    'limite_dt',
                    'solicitacao.name as user_solicitacao',
                    'coordenadora.name as user_coordenadora',
                    'solicitacao.id as user_solicitacao_id',
                    'coordenadora.id as user_coordenadora_id',
                    'ts.nome as status',
                    'ts.id as status_id',
                    'at.id as atividade_id',
                    'at.nome as atividade_name',
                )
                ->get()
                ->toArray();

            foreach ($query_f as $item) {
                $array_values = array_values($data['custom_filters']['coordenadora']);
                $value = [
                    'id' => $item['user_coordenadora_id'],
                    'name' => $item['user_coordenadora'],
                ];
                if (!in_array($value, $array_values)) {
                    $data['custom_filters']['coordenadora'][] = $value;
                }

                $array_values = array_values($data['custom_filters']['solicitado']);
                $value = [
                    'id' => $item['user_solicitacao_id'],
                    'name' => $item['user_solicitacao'],
                ];
                if (!in_array($value, $array_values)) {
                    $data['custom_filters']['solicitado'][] = $value;
                }

                $array_values = array_values($data['custom_filters']['status']);
                $value = [
                    'id' => $item['status_id'],
                    'name' => $item['status'],
                ];
                if (!in_array($value, $array_values)) {
                    $data['custom_filters']['status'][] = $value;
                }

                $array_values = array_values($data['custom_filters']['atividade']);
                $value = [
                    'id' => $item['atividade_id'],
                    'name' => $item['atividade_name'],
                ];
                if (!in_array($value, $array_values)) {
                    $data['custom_filters']['atividade'][] = $value;
                }

                $execucoes = Execucao::query()
                    ->join('users', 'users.id', '=', 'execucoes.executante_id')
                    ->where('tarefa_id', $item['id'])
                    ->select('executante_id', 'users.name')
                    ->get();

                foreach ($execucoes as $execucao) {
                    $value = [
                        'id' => $execucao->executante_id,
                        'name' => $execucao->name,
                    ];
                    if (!in_array($value, $data['custom_filters']['executantes'])) {
                        $data['custom_filters']['executantes'][] = $value;
                    }
                }

            }
            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function minhasTarefas(Request $request)
    {
        try {

            $executantes_sql = <<<eot
                (
                    select
                        group_concat(name SEPARATOR ", ") as executantes
                    from users
                    inner join execucoes on execucoes.executante_id = users.id
                    where execucoes.tarefa_id = tarefas.id
                ) as executantes
            eot;

            $user = Auth::user();
            $query = Tarefa::query()
                ->join('tarefa_status as ts', 'ts.id', '=', 'tarefas.tarefa_status_id')
                ->join('users as coordenadora', 'coordenadora.id', '=', 'tarefas.responsavel_user_id')
                ->join('users as solicitacao', 'solicitacao.id', '=', 'tarefas.solicitacao_user_id')
                ->leftJoin('atividade_tipos as at', 'at.id', '=', 'tarefas.atividade_id')
                ->whereHas('execucoes', function ($q2) use ($user) {
                    $q2->where('executante_id', $user->id);
                })
                ->when($request->has('coordenadoras'), function ($q) use ($request) {
                    $q->whereIn('coordenadora.id', json_decode($request->get('coordenadoras')));
                })
                ->when($request->has('prazo'), function ($q) use ($request) {
                    $q->where(function ($q2) use ($request) {
                        $q2->whereDate('limite_dt', new Carbon($request->get('prazo')));
                        $q2->orWhereDate('entrega_dt', new Carbon($request->get('prazo')));
                    });
                })
                ->when($request->has('status_filter'), function ($q) use ($request) {
                    $q->whereIn('ts.id', json_decode($request->get('status_filter')));
                })
                ->when($request->has('solicitacao_filter'), function ($q) use ($request) {
                    $q->whereIn('solicitacao.id', json_decode($request->get('solicitacao_filter')));
                })
                ->when($request->has('executantes'), function ($q) use ($request) {
                    $q->whereHas('execucoes', function ($q2) use ($request) {
                        $q2->whereIn('executante_id', json_decode($request->get('executantes')));
                    });
                })
                ->when($request->has('solicitado'), function ($q) use ($request) {
                    $q->whereDate('tarefas.created_at', new Carbon($request->get('solicitado')));
                })
                ->whereNot('ts.sistema', 'encerrada')
                ->select(
                    'tarefas.id',
                    'tarefas.created_at',
                    'tarefas.nome',
                    'at.nome as atividade',
                    'entrega_dt',
                    'limite_dt',
                    'solicitacao.name as user_solicitacao',
                    'coordenadora.name as user_coordenadora',
                    'ts.nome as status',
                    'processo_numero',
                    DB::raw($executantes_sql)
                );

            $columns = [
                'id' => 'tarefas.id',
                'created_at' => 'tarefas.created_at',
                'nome' => 'tarefas.nome',
                'entrega_dt' => 'entrega_dt',
                'limite_dt' => 'limite_dt',
                'user_solicitacao' => 'solicitacao.name',
                'user_coordenadora' => 'coordenadora.name',
                'status' => 'ts.nome',
                'processo_numero' => 'processo_numero',
                'atividade' => 'at.nome',
                'execucoes' => 'tarefas.id'
            ];

            $data = $this->commonRepository->datatablesServerSide($request->all(), $columns, $query);

            $data['custom_filters'] = [
                'executantes' => [],
                'status' => [],
                'solicitado' => [],
                'coordenadora' => [],
                'atividade' => [],
            ];

            $query_f = Tarefa::query()
                ->join('tarefa_status as ts', 'ts.id', '=', 'tarefas.tarefa_status_id')
                ->join('atividade_tipos as at', 'at.id', '=', 'tarefas.atividade_id')
                ->join('users as coordenadora', 'coordenadora.id', '=', 'tarefas.responsavel_user_id')
                ->join('users as solicitacao', 'solicitacao.id', '=', 'tarefas.solicitacao_user_id')
                ->whereHas('execucoes', function ($q2) use ($user) {
                    $q2->where('executante_id', $user->id);
                })
                ->select(
                    'tarefas.id',
                    'tarefas.created_at',
                    'tarefas.nome',
                    'entrega_dt',
                    'limite_dt',
                    'solicitacao.name as user_solicitacao',
                    'coordenadora.name as user_coordenadora',
                    'solicitacao.id as user_solicitacao_id',
                    'coordenadora.id as user_coordenadora_id',
                    'ts.nome as status',
                    'ts.id as status_id',
                    'at.id as atividade_id',
                    'at.nome as atividade_name'
                )
                ->get()
                ->toArray();

            foreach ($query_f as $item) {
                $array_values = array_values($data['custom_filters']['coordenadora']);
                $value = [
                    'id' => $item['user_coordenadora_id'],
                    'name' => $item['user_coordenadora'],
                ];
                if (!in_array($value, $array_values)) {
                    $data['custom_filters']['coordenadora'][] = $value;
                }

                $array_values = array_values($data['custom_filters']['solicitado']);
                $value = [
                    'id' => $item['user_solicitacao_id'],
                    'name' => $item['user_solicitacao'],
                ];
                if (!in_array($value, $array_values)) {
                    $data['custom_filters']['solicitado'][] = $value;
                }

                $array_values = array_values($data['custom_filters']['status']);
                $value = [
                    'id' => $item['status_id'],
                    'name' => $item['status'],
                ];
                if (!in_array($value, $array_values)) {
                    $data['custom_filters']['status'][] = $value;
                }

                $array_values = array_values($data['custom_filters']['atividade']);
                $value = [
                    'id' => $item['atividade_id'],
                    'name' => $item['atividade_name'],
                ];
                if (!in_array($value, $array_values)) {
                    $data['custom_filters']['atividade'][] = $value;
                }

                $execucoes = Execucao::query()
                    ->join('users', 'users.id', '=', 'execucoes.executante_id')
                    ->where('tarefa_id', $item['id'])
                    ->select('executante_id', 'users.name')
                    ->get();

                foreach ($execucoes as $execucao) {
                    $value = [
                        'id' => $execucao->executante_id,
                        'name' => $execucao->name,
                    ];
                    if (!in_array($value, $data['custom_filters']['executantes'])) {
                        $data['custom_filters']['executantes'][] = $value;
                    }
                }

            }
            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function view(Request $request, $id)
    {
        try {
            $data = Tarefa::query()
                ->with('filial:id,nome')
                ->with('execucoes')
                ->select(
                    'id',
                    'nome',
                    'created_at',
                    'responsavel_user_id',
                    'entrega_dt',
                    'limite_dt',
                    'descricao',
                    'tarefa_status_id',
                    'filial_id',
                    'descricao_execucao',
                    'solicitacao_user_id',
                    'processo_numero',
                    'atividade_id',
                )
                ->findOrFail($id);
            return response()->json(['success' => true, 'data' => $data ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        $tarefa = Tarefa::query()->findOrFail($id);
        if (Auth::user()->hasPerfil('subcoordenadora') && $tarefa->tarefa_status_id == 4) {
            throw new \Exception('Não é permitido excluir uma tarefa já encerrada');
        }
        $tarefa->delete();
        return response()->json(['success' => true ], 200);
    }

    public function save(Request $request)
    {
        try {
            DB::transaction(function () use ($request) {
                $user = Auth::user();
                $id = $request->get('id');
                if (empty($id)) {

                    if (!$user->hasPerfil(['admin', 'dev', 'diretoria', 'colaboradora', 'coordenadora', 'subcoordenadora', 'secretaria'])) {
                        throw new \Exception('Permissão negada');
                    }

                    $tarefa = new Tarefa();
                    $tarefa->solicitacao_user_id = Auth::user()->id;
                    $user_responsavel = User::query()->findOrFail($request->get('responsavel_user_id'));
                    $tarefa->filial_id = $user_responsavel->filial_id;
                    $this->savePart1($tarefa, $request->all());
                    $this->saveExecucoes($tarefa, $request->get('executamentos'));
                } else {
                    $tarefa = Tarefa::query()->findOrFail($id);
                    $execucoes_count = Execucao::query()
                        ->where('tarefa_id', $id)
                        ->count();

                    if ($user->hasPerfil('secretaria') && $execucoes_count > 0) {
                        throw new Exception('Você pode somente alterar quando não houver nenhuma execução para a tarefa');
                    }

                    if ($request->has('nome')) {
                        $this->savePart1($tarefa, $request->all());
                    }
                    if ($request->has('executamentos')) {
                        $this->saveExecucoes($tarefa, $request->get('executamentos'));
                    }
                }
            });
            return response()->json(['success' => true ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    private function savePart1($task, $data) {
        $task->nome = $data['nome'];
        $task->descricao = $data['descricao'];
        $task->descricao_execucao = $data['descricao_execucao'];
        if (empty($data['entrega_dt'])) {
            $task->entrega_dt = null;
        } else {
            $entrega_dt = new Carbon($data['entrega_dt']);
            $task->entrega_dt = $entrega_dt->format('Y-m-d H:m:i');
        }

        $limite_dt = new Carbon($data['limite_dt']);
        $task->limite_dt = $limite_dt->format('Y-m-d H:m:i');
        $task->descricao_execucao = $data['descricao_execucao'];
        $task->responsavel_user_id = $data['responsavel_user_id'];
        $task->tarefa_status_id = $data['tarefa_status_id'];
        $task->atividade_id = $data['atividade_id'];
        $task->processo_numero = $data['processo_numero'];
        $task->status_dt = date('Y-m-d H:m:i');
        $task->save();
    }

    private function saveExecucoes($task, $data, $edit_one = false) {
        if ($edit_one) {

            $execucoes = Execucao::query()
                ->where('tarefa_id', $task->id)
                ->where('executante_id', Auth::id())
                ->get();

            foreach ($execucoes as $execucao) {

                foreach ($data as $item) {
                    if ($item['id'] === $execucao->id) {
                        if (isset($item['nome'])) {
                            $execucao->nome = $item['nome'];
                        }
                        if (isset($item['executante_id'])) {
                            $execucao->executante_id = $item['executante_id'];
                        }
                        if (isset($item['limite_dt'])) {
                            $limite_dt = new Carbon($item['limite_dt']);
                            $execucao->limite_dt = $limite_dt->format('Y-m-d H:m:i');
                        }
                        $execucao->descricao = $item['descricao'] ?? '';
                        $execucao->status_id = $item['status_id'];
                        $execucao->tarefa_id = $task->id;
                        $execucao->save();
                    }
                }
            }

        } else {

//            $tarefa_status = TarefaStatus::query()->where('sistema', 'aguardando_execucao')->first();
//
//            $task->tarefa_status_id = $tarefa_status->id;
            $task->save();

            $execucoes = Execucao::query()
                ->where('tarefa_id', $task->id)
                ->pluck('id')
                ->toArray();

            $ids = [];
            foreach ($data as $item) {
                $ids[] = $item['id'];
            }

            foreach ($execucoes as $execucao) {

                if (!in_array($execucao, $ids)) {
                    Execucao::query()->findOrFail($execucao)->delete();
                }
            }

            foreach ($data as $item) {
                if (empty($item['id'])) {
                    $execucao = new Execucao();
                } else {
                    $execucao = Execucao::query()->findOrFail($item['id']);
                }

                if (isset($item['nome'])) {
                    $execucao->nome = $item['nome'];
                }
                if (isset($item['executante_id'])) {
                    $execucao->executante_id = $item['executante_id'];
                }
                if (isset($item['limite_dt'])) {
                    $limite_dt = new Carbon($item['limite_dt']);
                    $execucao->limite_dt = $limite_dt->format('Y-m-d H:m:i');
                }
                $execucao->descricao = $item['descricao'] ?? '';
                $execucao->status_id = $item['status_id'];
                $execucao->tarefa_id = $task->id;
                $execucao->save();

            }
        }
    }

    public function getCoordenadoras(Request $request)
    {
        try {

            $data = User::query()
                ->join('perfis as p', 'p.id', '=', 'users.perfil_id')
                ->whereIn('p.sistema', ['coordenadora', 'diretoria', 'secretaria'])
                ->select(
                    'users.id',
                    'name',
                )
                ->orderBy('name')
                ->get();
            return response()->json(['success' => true, 'data' => $data ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function users(Request $request)
    {
        try {

            $data = User::query()
                ->join('perfis as p', 'p.id', '=', 'users.perfil_id')
                ->select(
                    'users.id',
                    'name',
                )
                ->get();
            return response()->json(['success' => true, 'data' => $data ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function atividades(Request $request)
    {
        try {

            $data = AtividadeTipos::query()
                ->select(
                    'id',
                    'nome',
                )
                ->get();
            return response()->json(['success' => true, 'data' => $data ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function getColaboradoras(Request $request, $coordenadora_id)
    {
        try {

            $data = User::query()
                ->join('perfis as p', 'p.id', '=', 'users.perfil_id')
                ->where(function ($q) {
                    $q->whereIn('p.sistema', ['colaboradora', 'coordenadora', 'diretoria']);
                    $q->orWhereIn('setor_id', [6]);
                })
                ->when(!empty($coordenadora_id), function ($q) use ($coordenadora_id) {
                    $coordenadora = User::query()->findOrFail($coordenadora_id);
                    $q->whereIn('setor_id', [$coordenadora->setor_id, 6]);
                })
                ->select(
                    'users.id',
                    'name',
                )
                ->orderBy('name')
                ->get();
            return response()->json(['success' => true, 'data' => $data ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function getStatus(Request $request)
    {
        try {
            $data = TarefaStatus::query()
                ->select(
                    'id',
                    'nome',
                )
                ->get();
            return response()->json(['success' => true, 'data' => $data ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function encerrar(Request $request, $id)
    {
        try {

            $tarefa = Tarefa::query()->findOrFail($id);

            $tarefa_status = TarefaStatus::query()->where('sistema', 'encerrada')->first();

            $tarefa->tarefa_status_id = $tarefa_status->id;
            $tarefa->status_dt = date('Y-m-d H:m:i');
            $tarefa->save();

            return response()->json(['success' => true], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
