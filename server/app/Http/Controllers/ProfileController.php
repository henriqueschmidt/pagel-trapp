<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;


class ProfileController extends Controller
{
    public function view(Request $request)
    {
        try {
            $data = User::query()
                ->leftJoin('filiais', 'filiais.id', '=', 'users.filial_id')
                ->leftJoin('setores', 'setores.id', '=', 'users.setor_id')
                ->leftJoin('perfis', 'perfis.id', '=', 'users.perfil_id')
                ->select(
                    'users.id',
                    'users.email',
                    'users.name',
                    'setores.nome as setor',
                    'filiais.nome as filial',
                    'perfis.nome as perfil',
                )
                ->findOrFail(Auth::id());
            return response()->json(['success' => true, 'data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function save(Request $request)
    {
        try {
            $data = User::query()->findOrFail(Auth::id());

            if ($request->has('password')) {
                $data->password = $request->get('password');
            }

            $data->name = $request->get('name');
            $data->email = $request->get('email');
            $data->save();

            return response()->json(['success' => true, 'data' => $data ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
