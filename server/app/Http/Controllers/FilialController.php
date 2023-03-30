<?php

namespace App\Http\Controllers;

use App\Models\Filial;
use App\Repositories\CommonRepository;
use Illuminate\Http\Request;

class FilialController extends Controller
{

    protected CommonRepository $commonRepository;

    public function __construct(CommonRepository $commonRepository) {
        $this->commonRepository = $commonRepository;
    }

    public function index(Request $request)
    {
        try {

            $query = Filial::query()
                ->select(
                    'id',
                    'nome',
                    'telefone',
                    'endereco',
                );

            $columns = [
                'id' => 'id',
                'nome' => 'nome',
                'telefone' => 'telefone',
                'endereco' => 'endereco',
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
            $filiais = Filial::query()
                ->select(
                    'id',
                    'nome',
                    'telefone',
                    'endereco',
                )
                ->findOrFail($id);
            return response()->json(['success' => true, 'data' => $filiais ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        Filial::query()->findOrFail($id)->delete();
        return response()->json(['success' => true ], 200);
    }

    public function save(Request $request)
    {
        try {
            $id = $request->get('id');
            if (empty($id)) {
                $filial = new Filial();
            } else {
                $filial = Filial::query()->findOrFail($id);
            }

            $filial->nome = $request->get('nome');
            $filial->telefone = $request->get('telefone');
            $filial->endereco = $request->get('endereco');
            $filial->save();

            return response()->json(['success' => true ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

}
