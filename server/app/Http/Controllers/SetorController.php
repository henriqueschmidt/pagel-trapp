<?php

namespace App\Http\Controllers;

use App\Models\Filial;
use App\Models\Setor;
use App\Repositories\CommonRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class SetorController extends Controller
{

    protected CommonRepository $commonRepository;

    public function __construct(CommonRepository $commonRepository) {
        $this->commonRepository = $commonRepository;
    }

    public function index(Request $request)
    {
        try {

            $query = Setor::query()
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
            $setores = Setor::query()
                ->select(
                    'id',
                    'nome',
                )
                ->findOrFail($id);
            return response()->json(['success' => true, 'data' => $setores ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        Setor::query()->findOrFail($id)->delete();
        return response()->json(['success' => true ], 200);
    }

    public function save(Request $request)
    {
        try {
            $id = $request->get('id');
            if (empty($id)) {
                $setor = new Setor();
            } else {
                $setor = Setor::query()->findOrFail($id);
            }

            $setor->nome = $request->get('nome');
            $setor->save();

            return response()->json(['success' => true ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

}
