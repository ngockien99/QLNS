<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use App\Models\User;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $validated = $request->validated();
        $credentials = $request->only('email', 'password');
        if ( !$token = JWTAuth::attempt($credentials)) {
            $params = 'Tài khoản hoặc mật khẩu không chính xác';
            return $this->responseError($params);
        }
        if ($request->remember === true) {
            JWTAuth::factory()->setTTL(60*60*7);
        }
        $user = User::find(Auth::user()->id);
        $params = [
            'token' => $token,
            'role' => $user->role,
            'user_id' => $user->id
        ];
        return $this->responseSuccess($params)->header('Authorization', $token);
    }

    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();

        $user = new User;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->name = $request->name;
        $user->password = bcrypt($request->password);
        $user->role = 1;
        $user->image = 'image';
        $user->save();
        return $this->responseSuccess();
    }

    public function logout(Request $request)
    {
        $this->validate($request, [
            'token' => 'required'
        ]);

        try {
            JWTAuth::invalidate($request->token);
            return $this->responseSuccess();
        } catch (JWTException $exception) {
            $params = 'Bạn chưa đăng nhập';
            return $this->responseError($params);
        }
    }

    public function refresh()
    {
        return response([
            'status' => 'success'
        ]);
    }
}
