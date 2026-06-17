<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Supplier;

class SupplierPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermission('suppliers', 'view');
    }

    public function view(User $user, Supplier $supplier)
    {
        return $user->hasPermission('suppliers', 'view');
    }

    public function create(User $user)
    {
        return $user->hasPermission('suppliers', 'create');
    }

    public function update(User $user, Supplier $supplier)
    {
        return $user->hasPermission('suppliers', 'edit');
    }

    public function delete(User $user, Supplier $supplier)
    {
        return $user->hasPermission('suppliers', 'delete');
    }
}
