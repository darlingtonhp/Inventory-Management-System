<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserCRUDResource;
use App\Models\User;
use App\Models\Role;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

class UserController extends Controller
{
    public function index()
    {
        $query = User::with('role');
        $sortFields = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", 'desc');

        if (request("name")) {
            $query->where("name", "like", "%" . request('name') . "%");
        }
        if (request("email")) {
            $query->where("email", "like", "%" . request('email') . "%");
        }
        if (request("role_id")) {
            $query->where("role_id", request("role_id"));
        }

        $users = $query->orderBy($sortFields, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("User/Index", [
            "users" => UserCRUDResource::collection($users),
            "roles" => Role::all(),
            "queryParams" => request()->query() ?: null,
            "success" => session("success"),
        ]);
    }

    public function create()
    {
        return inertia("User/Create", [
            "roles" => Role::all(),
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['email_verified_at'] = now();
        $data['password'] = bcrypt($data['password']);
        
        User::create($data);

        return redirect()->route('user.index')
            ->with('success', __('User was successfully created'));
    }

    public function edit(User $user)
    {
        return inertia('User/Edit', [
            'user' => new UserCRUDResource($user),
            'roles' => Role::all(),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        $password = $data['password'] ?? null;
        if ($password) {
            $data['password'] = bcrypt($password);
        } else {
            unset($data['password']);
        }
        
        $user->update($data);
        
        return redirect()->route('user.index')
            ->with('success', __('User ' . $user->name . ' was updated successfully'));
    }

    public function destroy(User $user)
    {
        // Prevent users from deleting themselves
        if (auth()->id() === $user->id) {
            return redirect()->route('user.index')
                ->with('error', __('You cannot delete your own account.'));
        }

        $name = $user->name;
        $user->delete();

        return redirect()->route('user.index')
            ->with('success', __('User ') . $name . ' was deleted');
    }
}
