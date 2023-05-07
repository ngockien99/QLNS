<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

class Admin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $token = $request->bearerToken();
            $user = JWTAuth::toUser(JWTAuth::setToken($token)->getPayload());

            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Tài khoản chưa đăng nhập',
                    'code' => 'M4'
                ], 401);
            }

            // $projects = $this->myService->projects($visitor->uvid, $visitor->session_id, 0);

            // if (!$projects) {
            //     return response()->json([
            //         'status' => false,
            //         'message' => 'Token hết hạn',
            //         'code' => 'M4'
            //     ], 401);
            // }

            $user = User::where('id', $user->id)->first();

            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy thông tin tài khoản'
                ], 401);
            }

            $request->merge(['token' => $token, 'user' => $user]);

            return $next($request);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi hệ thống',
                'code' => 'M8'
            ], 401);
        }
    }
}
