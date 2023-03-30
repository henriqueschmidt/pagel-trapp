<?php

namespace App\Http\Controllers;

use App\Models\Filial;
use App\Models\Perfil;
use App\Models\Setor;
use App\Models\User;
use App\Repositories\CommonRepository;
use App\Repositories\UsersRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    protected UsersRepository $usersRepository;
    protected CommonRepository $commonRepository;

    public function __construct(UsersRepository $usersRepository, CommonRepository $commonRepository) {
        $this->usersRepository = $usersRepository;
        $this->commonRepository = $commonRepository;
    }

    public function index(Request $request)
    {
        try {

            $query = User::query()
                ->join('perfis as p', 'p.id', '=','users.perfil_id')
                ->leftJoin('filiais as f', 'f.id', '=','users.filial_id')
                ->leftJoin('setores as s', 's.id', '=','users.setor_id')
                ->select(
                    'users.id',
                    'name',
                    'email',
                    'p.nome as perfil',
                    'f.nome as filial',
                    's.nome as setor',
                );

            $columns = [
                'id' => 'users.id',
                'name' => 'users.name',
                'perfil' => 'p.nome',
                'filial' => 'f.nome',
                'setor' => 's.nome',
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
            $users = User::query()
                ->select(
                    'id',
                    'name',
                    'perfil_id',
                    'email',
                    'filial_id',
                    'setor_id',
                    'coordenadora_id'
                )
                ->findOrFail($id);
            return response()->json(['success' => true, 'data' => $users ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        User::query()->findOrFail($id)->delete();
        return response()->json(['success' => true ], 200);
    }

    public function save(Request $request)
    {
        try {
            $id = $request->get('id');
            if (empty($id)) {

                if ($this->usersRepository->checkIfExists($request->get('email'))) {
                    throw new \Exception('Usuário já cadastrado');
                }

                $user = new User();
                $user->password = '123456';
            } else {
                $user = User::query()->findOrFail($id);
            }

            $perfil = Perfil::query()->find($request->get('perfil_id'));
            if (empty($perfil)) {
                throw new \Exception('Perfil não encontrado');
            }

            $user->name = $request->get('name');
            $user->email = $request->get('email');
            $user->perfil_id = $request->get('perfil_id');
            $user->filial_id = $request->get('filial_id');
            $user->setor_id = $request->get('setor_id');
            $user->coordenadora_id = $request->get('coordenadora_id');
            if ($request->has('password') && !empty($request->get('password'))) {
                $user->password = $request->get('password');
            }
            $user->save();

            return response()->json(['success' => true ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function perfis(Request $request)
    {
        try {
            $users = Perfil::query()
                ->select(
                    'id',
                    'nome',
                )
                ->whereNot('sistema', 'dev')
                ->get();

            return response()->json(['success' => true, 'data' => $users ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function filiais(Request $request)
    {
        try {
            $users = Filial::query()
                ->select(
                    'id',
                    'nome'
                )
                ->get();

            return response()->json(['success' => true, 'data' => $users ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function coordenadoras(Request $request)
    {
        try {

            $data = User::query()
                ->join('perfis as p', 'p.id', '=', 'users.perfil_id')
                ->whereIn('p.sistema', ['coordenadora', 'diretoria'])
                ->select(
                    'users.id',
                    'name as nome',
                )
                ->get();
            return response()->json(['success' => true, 'data' => $data ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }


    public function setores(Request $request)
    {
        try {
            $data = Setor::query()
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
}
