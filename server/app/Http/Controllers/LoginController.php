<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginFormRequest;
use App\Models\Perfil;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    const INVALID_EMAIL = 'Credenciais invalidas.';
    const FAILED_TOKEN = 'something went wrong!';
    public array $message = ['0' => 'Email is not verified.', '1' => 'Successfully login', '2' => 'User is not available'];

    public function authenticate(LoginFormRequest $request)
    {

        $credentials = $request->only('email', 'password');
        $password = $request->get('password');
        try {
            $user_data = User::query()->where('email', $credentials['email'])->first();
            if (empty($user_data)) {
                return response()->json(['success' => false, 'message' => self::INVALID_EMAIL], 500);
            }

            if (Auth::attempt(['email' => $credentials['email'], 'password' => $password ])) {
                $user = Auth::user();
                $token = $user->createToken('JWT', $user->permissoes());
                return response()->json([
                    'token' => $token->plainTextToken,
                    'perfil' => $user->perfil()->sistema,
                    'user_name' => $user->name,
                    'permissoes' => $token->accessToken->abilities,
                    'user_id' => $user->id,
                ], 200);
            }

            return response()->json(['success' => false, 'message' => self::INVALID_EMAIL], 500);
        } catch (\Exception $e) {
            dd($e);
            return response()->json(['success' => false, 'message' => self::FAILED_TOKEN], 500);
        }
    }
}
