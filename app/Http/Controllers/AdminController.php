<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use App\Models\AuditLog;
use App\Models\Setting;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function roles()
    {
        $roles = Role::with('permissions')->get();
        return inertia('Admin/Roles', [
            'roles' => $roles,
            'modules' => ['catalog', 'suppliers', 'purchasing', 'sales', 'stock', 'reports', 'admin'],
            'success' => session('success'),
        ]);
    }

    public function saveRoles(Request $request)
    {
        $validated = $request->validate([
            'permissions' => 'required|array',
            'permissions.*.id' => 'required|exists:permissions,id',
            'permissions.*.can_view' => 'required|boolean',
            'permissions.*.can_create' => 'required|boolean',
            'permissions.*.can_edit' => 'required|boolean',
            'permissions.*.can_delete' => 'required|boolean',
        ]);

        foreach ($validated['permissions'] as $permData) {
            $permission = Permission::findOrFail($permData['id']);
            $permission->update([
                'can_view' => $permData['can_view'],
                'can_create' => $permData['can_create'],
                'can_edit' => $permData['can_edit'],
                'can_delete' => $permData['can_delete'],
            ]);
        }

        return redirect()->route('admin.roles')->with('success', 'Roles and permissions matrix updated successfully.');
    }

    public function auditLogs()
    {
        $logs = AuditLog::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return inertia('Admin/AuditLogs', [
            'logs' => $logs,
        ]);
    }

    public function settings()
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();
        return inertia('Admin/Settings', [
            'settings' => $settings,
            'success' => session('success'),
        ]);
    }

    public function saveSettings(Request $request)
    {
        $settings = $request->except('_token');

        foreach ($settings as $key => $value) {
            Setting::setValue($key, $value);
        }

        return redirect()->route('admin.settings')->with('success', 'System configurations updated successfully.');
    }
}
