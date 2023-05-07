<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

class Permission
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
                    'message' => 'Tài khoản chưa đăng nhập'
                ], 401);
            }

            $user = User::where('id', $user->id)->first();

            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy thông tin tài khoản'
                ], 401);
            }

            $permission = $this->_checkPermission($request, $user);

            if (!$permission) {
                return response()->json([
                    'status' => false,
                    'message' => 'Bạn không có quyền thực hiện chức năng này',
                    'error_code' => 'M11'
                ], 200);
            }

            return $next($request);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi hệ thống'
            ], 401);
        }
    }


    /**
     * function check quyen cua user
     * @param Request $request
     * @param $user
     * @return Boolean
     */
    protected function _checkPermission($request, $user)
    {
        $prefix = substr_replace($request->route()->getPrefix(), '', 0, 4);

        $permissions = config('permission.permissions');

        $permission = @$permissions[$prefix];
        if (!empty($permission)) {
            if (($user->role & $permission) == 0) {
                return true;
            }
        }

        return true;
    }
}
