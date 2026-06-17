<?php

namespace App\Policies;

use App\Models\User;
use App\Models\StockMovement;

class StockMovementPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermission('stock', 'view');
    }

    public function view(User $user, StockMovement $stockMovement)
    {
        return $user->hasPermission('stock', 'view');
    }

    public function create(User $user)
    {
        return $user->hasPermission('stock', 'create');
    }

    public function update(User $user, StockMovement $stockMovement)
    {
        return $user->hasPermission('stock', 'edit');
    }

    public function delete(User $user, StockMovement $stockMovement)
    {
        return $user->hasPermission('stock', 'delete');
    }
}
