<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermission('admin', 'view');
    }

    public function view(User $user, User $targetUser)
    {
        return $user->hasPermission('admin', 'view');
    }

    public function create(User $user)
    {
        return $user->hasPermission('admin', 'create');
    }

    public function update(User $user, User $targetUser)
    {
        return $user->hasPermission('admin', 'edit');
    }

    public function delete(User $user, User $targetUser)
    {
        // Prevent users from deleting themselves
        if ($user->id === $targetUser->id) {
            return false;
        }
        return $user->hasPermission('admin', 'delete');
    }
}
