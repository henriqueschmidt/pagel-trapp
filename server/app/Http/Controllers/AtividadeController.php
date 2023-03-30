<?php

namespace App\Http\Controllers;

use App\Models\AtividadeTipos;
use App\Models\Tarefa;
use App\Repositories\CommonRepository;
use Illuminate\Http\Request;

class AtividadeController extends Controller
{

    protected CommonRepository $commonRepository;

    public function __construct(CommonRepository $commonRepository) {
        $this->commonRepository = $commonRepository;
    }

    public function index(Request $request)
    {
        try {

            $query = AtividadeTipos::query()
                ->select(
                    'id',
                    'nome',
                );

            $columns = [
                'id' => 'id',
                'nome' => 'nome',
            ];

            $data = $this->commonRepository->datatablesServerSide($request->all(), $columns, $query);

            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function view(Request $request, $id)
    {
        try {
            $data = AtividadeTipos::query()
                ->select(
                    'id',
                    'nome',
                )
                ->findOrFail($id);
            return response()->json(['success' => true, 'data' => $data ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, $id)
    {

        $related_tasks = Tarefa::query()->where('atividade_id', $id)->count();

        if ($related_tasks > 0) {
            return response()->json(['success' => false, 'message' => 'Essa atividade não pode ser excluida pois já faz parte de ao menos uma tarefa'], 500);
        }

        AtividadeTipos::query()->findOrFail($id)->delete();

        return response()->json(['success' => true ], 200);
    }

    public function save(Request $request)
    {
        try {
            $id = $request->get('id');
            if (empty($id)) {
                $data = new AtividadeTipos();
            } else {
                $data = AtividadeTipos::query()->findOrFail($id);
            }

            $data->nome = $request->get('nome');
            $data->save();

            return response()->json(['success' => true ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

}
