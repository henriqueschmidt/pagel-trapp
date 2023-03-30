<?php

namespace App\Http\Controllers;

use App\Models\AtividadeTipos;
use App\Models\Execucao;
use App\Models\Filial;
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

class RelatorioController extends Controller
{

    protected CommonRepository $commonRepository;

    public function __construct(CommonRepository $commonRepository)
    {
        $this->commonRepository = $commonRepository;
    }

    public function users(Request $request)
    {
        try {

            $data = User::query()
                ->join('perfis as p', 'p.id', '=', 'users.perfil_id')
                ->select(
                    'users.id',
                    'name as nome',
                    'p.sistema as perfil'
                )
                ->orderBy('name')
                ->get();
            return response()->json(['success' => true, 'data' => $data ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function filiais(Request $request)
    {
        try {

            $data = Filial::query()
                ->select(
                    'id',
                    'nome',
                )
                ->orderBy('nome')
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
                ->orderBy('nome')
                ->get();
            return response()->json(['success' => true, 'data' => $data ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function gerar(Request $request)
    {
        try {

            $data = [
                'count' => [],
                'details' => [],
            ];

            $equipe = json_decode($request->get('equipe'));
            $filial = $request->has('filial') ? json_decode($request->get('filial')) : [];
            $atividade = json_decode($request->get('atividade'));

            $relatorio = $request->get('relatorio');

            $first_date = new Carbon($request->get('first_date'));
            $second_date = new Carbon($request->get('second_date'));
            $second_date = $second_date->endOfDay();

            $new_relatorio = new Relatorio();
            $new_relatorio->equipe = $request['equipe'] ?? null;
            $new_relatorio->filial = $request['filial'] ?? null;
            $new_relatorio->tipo_atividade = $request['atividade'] ?? null;
            $new_relatorio->relatorio = $request['relatorio'] ?? null;
            $new_relatorio->periodo = json_encode([$first_date, $second_date]);
            $new_relatorio->save();

            $status_tarefas_abertas = TarefaStatus::query()
                ->whereIn('sistema', ['andamento', 'aguardando_revisao', 'aguardando'])
                ->pluck('id')
                ->toArray();

            $status_tarefa_concluida = TarefaStatus::query()
                ->whereIn('sistema', ['encerrada'])
                ->pluck('id')
                ->toArray();


            
            if ($relatorio == 'executante') {
                $criadas = $this->executanteBaseQuery($request)
                    ->whereBetween('execucoes.created_at', [$first_date, $second_date]);
                
                $em_aberto = $this->executanteBaseQuery($request)
                    ->whereDate('execucoes.created_at', '<=', $second_date)
                    ->where(function($q) use($status_tarefa_concluida, $second_date) {
                        $q->whereNotIn('ts.id', $status_tarefa_concluida);
                        $q->orWhere(function($q2) use($status_tarefa_concluida, $second_date) {
                            $q2->whereIn('ts.id', $status_tarefa_concluida);
                            $q2->whereDate('execucoes.updated_at', '>', $second_date);
                        });
                    });

                $concluidas = $this->executanteBaseQuery($request)
                    ->whereBetween('execucoes.updated_at', [$first_date, $second_date])
                    ->whereIn('ts.id', $status_tarefa_concluida);
            }
            
            if ($relatorio == 'coordenadora') {
                $criadas = $this->coordenadoraBaseQuery($request)
                    ->whereBetween('tarefas.created_at', [$first_date, $second_date]);
                
                $em_aberto = $this->coordenadoraBaseQuery($request)
                    ->whereDate('tarefas.created_at', '<=', $second_date)
                    ->where(function($q) use($status_tarefa_concluida, $second_date) {
                        $q->whereNotIn('ts.id', $status_tarefa_concluida);
                        $q->orWhere(function($q2) use($status_tarefa_concluida, $second_date) {
                            $q2->whereIn('ts.id', $status_tarefa_concluida);
                            $q2->whereDate('tarefas.encerramento_dt', '>', $second_date);
                        });
                    });

                $concluidas = $this->coordenadoraBaseQuery($request)
                    ->whereBetween('tarefas.encerramento_dt', [$first_date, $second_date])
                    ->whereIn('ts.id', $status_tarefa_concluida);
            }

            if ($relatorio != 'executante' && $relatorio != 'coordenadora') {
                
                $criadas = $this->baseQuery($request)
                    ->whereBetween('tarefas.created_at', [$first_date, $second_date]);

                if ($first_date > new Carbon('2023-02-22')) {
                    $em_aberto = $this->baseQuery($request)
                        ->whereDate('tarefas.created_at', '<=', $second_date)
                        ->where(function ($q) use($second_date) {
                            $q->whereNull('tarefas.encerramento_dt');
                            $q->orWhereDate('tarefas.encerramento_dt', '>', $second_date);
                        });
    
                    $concluidas = $this->baseQuery($request)
                        ->whereIn('tarefas.tarefa_status_id', $status_tarefa_concluida)
                        ->whereBetween('tarefas.encerramento_dt', [$first_date, $second_date]);
    
                } else {
                    // gambiarra pq nao tinha salvo a data de encerramento
                    $em_aberto = $this->baseQuery($request)
                        ->whereDate('tarefas.created_at', '<=', $second_date)
                        ->where(function($q) use($first_date, $second_date,$status_tarefa_concluida, $status_tarefas_abertas) {
                            $q->whereDate('tarefas.status_dt', '>', $second_date);
                            $q->orWhere(function ($q2) use($first_date, $second_date, $status_tarefas_abertas) {
                                $q2->whereIn('tarefas.tarefa_status_id', $status_tarefas_abertas);
                                $q2->whereDate('tarefas.created_at', '<=', $second_date);
                            });
                        });
    
                    $concluidas = $this->baseQuery($request)
                        ->whereIn('tarefas.tarefa_status_id', $status_tarefa_concluida)
                        ->where(function($q) use($first_date, $second_date) {
                            $q->whereBetween('tarefas.status_dt', [$first_date, $second_date]);
                            $q->orWhereBetween('tarefas.encerramento_dt', [$first_date, $second_date]);
                        });
                }
    
            }
            
            $tarefa_ids = [
                ... $criadas->pluck('tarefas.id')->toArray(),
                ... $em_aberto->pluck('tarefas.id')->toArray(),
                ... $concluidas->pluck('tarefas.id')->toArray(),
            ];
            
            $new_relatorio->tarefa_ids = json_encode($tarefa_ids);
            $new_relatorio->tarefas_novas_ids = json_encode($criadas->pluck('tarefas.id')->toArray());
            $new_relatorio->tarefas_em_andamento_ids = json_encode($em_aberto->pluck('tarefas.id')->toArray());
            $new_relatorio->tarefa_concluidas_ids = json_encode($concluidas->pluck('tarefas.id')->toArray());
            $new_relatorio->save();

            $data['count']['criadas'] = $criadas->count('tarefas.id');
            $data['count']['em_aberto'] = $em_aberto->count('tarefas.id');
            $data['count']['concluidas'] = $concluidas->count('tarefas.id');

            $details = $this->detailsFormatter([], $criadas, 'novas', $relatorio, $equipe);
            $details = $this->detailsFormatter($details, $em_aberto, 'em_aberto', $relatorio, $equipe);
            $data['details'] = $this->detailsFormatter($details, $concluidas, 'concluidas', $relatorio, $equipe);
            $data['id'] = $new_relatorio->id;

            return response()->json(['success' => true, 'data' => $data ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    private function executanteBaseQuery($request) {
        $equipe = $request->has('equipe') ? json_decode($request->get('equipe')) : [];
        $atividade = $request->has('atividade') ? json_decode($request->get('atividade')) : [];

        return Execucao::query()
            ->join('users as u', 'u.id', '=', 'execucoes.executante_id')
            ->join('tarefas as tarefas', 'tarefas.id', '=', 'execucoes.tarefa_id')
            ->join('tarefa_status as ts', 'ts.id', '=', 'execucoes.status_id')
            ->join('atividade_tipos as atividade', 'atividade.id', '=', 'tarefas.atividade_id')
            ->when(!empty($atividade), function ($q) use($atividade) {
                $q->whereIn('atividade_id', $atividade);
            })
            ->when(!empty($equipe), function ($q) use($equipe) {
                $q->whereIn('executante_id', $equipe);
            });
    }

    private function coordenadoraBaseQuery($request) {
        $equipe = $request->has('equipe') ? json_decode($request->get('equipe')) : [];
        $atividade = $request->has('atividade') ? json_decode($request->get('atividade')) : [];

        return Tarefa::query()
            ->join('users as u', 'u.id', '=', 'tarefas.responsavel_user_id')
            ->join('tarefa_status as ts', 'ts.id', '=', 'tarefas.tarefa_status_id')
            ->join('atividade_tipos as atividade', 'atividade.id', '=', 'tarefas.atividade_id')
            ->when(!empty($atividade), function ($q) use($atividade) {
                $q->whereIn('atividade_id', $atividade);
            })
            ->when(!empty($equipe), function ($q) use($equipe) {
                $q->whereIn('responsavel_user_id', $equipe);
            });
    }

    private function baseQuery($request) {
        $equipe = $request->has('equipe') ? json_decode($request->get('equipe')) : [];
        $filial = $request->has('filial') ? json_decode($request->get('filial')) : [];
        $atividade = $request->has('atividade') ? json_decode($request->get('atividade')) : [];
        $relatorio = $request->get('relatorio');

        return Tarefa::query()
            ->join('tarefa_status as ts', 'ts.id', '=', 'tarefas.tarefa_status_id')
            ->join('atividade_tipos as atividade', 'atividade.id', '=', 'tarefas.atividade_id')
            ->join('users as coordenadora', 'coordenadora.id', '=', 'responsavel_user_id')
            ->join('setores as setor', 'setor.id', '=', 'coordenadora.setor_id')
            ->leftJoin('execucoes as e', 'e.tarefa_id', '=', 'tarefas.id')
            ->when($relatorio == 'executante' && !empty($equipe), function ($q) use($equipe) {
                $q->whereIn('e.executante_id', $equipe);
            })
            ->when($relatorio == 'filial' && !empty($filial), function ($q) use($filial) {
                $q->whereIn('tarefas.filial_id', $filial);
            })
            ->when(!empty($atividade), function ($q) use($atividade) {
                $q->whereIn('atividade_id', $atividade);
            })
            ->distinct();
    }

    private function detailsFormatter($data, $query, $status, $relatorio, $equipe) {
        $select = [
            'tarefas.id',
            'tarefas.nome',
            'atividade.nome as atividade',
            'ts.nome as status',
        ];

        if ($relatorio == 'executante') {
            $users = User::query()
                ->whereIn('id', $equipe)
                ->pluck('name', 'id')
                ->toArray();

            foreach ($users as $user_id => $user_name) {
                if (!isset($data[$user_id])) {
                    $data[$user_id] = [
                        'user_name' => $user_name,
                        'total' => 0,
                        'novas' => 0,
                        'em_aberto' => 0,
                        'concluidas' => 0,
                        'atividades' => [],
                    ];
                }
            }
      
            $select[] = 'executante_id';
            $tarefas = $query
                ->select($select)
                ->get();

            foreach ($tarefas as $tarefa) {
                if (!isset($data[$tarefa->executante_id])) {
                    $user_name = User::query()->find($tarefa->executante_id);
                    if (empty($user_name)) {
                        continue;
                    }
                    $data[$tarefa->executante_id] = [
                        'user_name' => $user_name->name,
                        'total' => 0,
                        'novas' => 0,
                        'em_aberto' => 0,
                        'concluidas' => 0,
                        'atividades' => [],
                    ];
                }
                $data[$tarefa->executante_id]['total']++;
                $data[$tarefa->executante_id][$status]++;
                if (!isset($data[$tarefa->executante_id]['atividades'][$tarefa->atividade])) {
                    $data[$tarefa->executante_id]['atividades'][$tarefa->atividade] = [
                        'total' => 0,
                        'novas' => 0,
                        'em_aberto' => 0,
                        'concluidas' => 0,
                    ];
                }
                $data[$tarefa->executante_id]['atividades'][$tarefa->atividade]['total']++;
                $data[$tarefa->executante_id]['atividades'][$tarefa->atividade][$status]++;
            }
        }

        if ($relatorio == 'coordenadora') {
            $users = User::query()
                ->whereIn('id', $equipe)
                ->pluck('name', 'id')
                ->toArray();

            foreach ($users as $user_id => $user_name) {
                if (!isset($data[$user_id])) {
                    $data[$user_id] = [
                        'user_name' => $user_name,
                        'total' => 0,
                        'novas' => 0,
                        'em_aberto' => 0,
                        'concluidas' => 0,
                        'atividades' => [],
                    ];
                }
            }
      
            $select[] = 'responsavel_user_id';
            $tarefas = $query
                ->select($select)
                ->get();

            foreach ($tarefas as $tarefa) {
                if (!isset($data[$tarefa->responsavel_user_id])) {
                    $user_name = User::query()->find($tarefa->responsavel_user_id);
                    if (empty($user_name)) {
                        continue;
                    }
                    $data[$tarefa->responsavel_user_id] = [
                        'user_name' => $user_name->name,
                        'total' => 0,
                        'novas' => 0,
                        'em_aberto' => 0,
                        'concluidas' => 0,
                        'atividades' => [],
                    ];
                }
                $data[$tarefa->responsavel_user_id]['total']++;
                $data[$tarefa->responsavel_user_id][$status]++;
                if (!isset($data[$tarefa->responsavel_user_id]['atividades'][$tarefa->atividade])) {
                    $data[$tarefa->responsavel_user_id]['atividades'][$tarefa->atividade] = [
                        'total' => 0,
                        'novas' => 0,
                        'em_aberto' => 0,
                        'concluidas' => 0,
                    ];
                }
                $data[$tarefa->responsavel_user_id]['atividades'][$tarefa->atividade]['total']++;
                $data[$tarefa->responsavel_user_id]['atividades'][$tarefa->atividade][$status]++;
            }
        }

        if ($relatorio == 'filial') {
            $tarefas = $query->select($select)->get();

            foreach ($tarefas as $tarefa) {
                if (!isset($data[$tarefa->atividade])) {
                    $data[$tarefa->atividade] = [
                        'total' => 0,
                        'novas' => 0,
                        'em_aberto' => 0,
                        'concluidas' => 0,
                    ];
                }
                $data[$tarefa->atividade]['total']++;
                $data[$tarefa->atividade][$status]++;
            }
        }

        if ($relatorio == 'setor') {
            $select[] = 'setor.nome as setor';
            $tarefas = $query->select($select)->get();

            foreach ($tarefas as $tarefa) {
                if (!isset($data[$tarefa->setor])) {
                    $data[$tarefa->setor] = [
                        'total' => 0,
                        'novas' => 0,
                        'em_aberto' => 0,
                        'concluidas' => 0,
                    ];
                }
                $data[$tarefa->setor]['total']++;
                $data[$tarefa->setor][$status]++;
            }
        }

        return $data;
    }

}
