<?php

namespace App\Policies;

use App\Models\User;
use App\Models\SalesOrder;

class SalesOrderPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermission('sales', 'view');
    }

    public function view(User $user, SalesOrder $salesOrder)
    {
        return $user->hasPermission('sales', 'view');
    }

    public function create(User $user)
    {
        return $user->hasPermission('sales', 'create');
    }

    public function update(User $user, SalesOrder $salesOrder)
    {
        return $user->hasPermission('sales', 'edit');
    }

    public function delete(User $user, SalesOrder $salesOrder)
    {
        return $user->hasPermission('sales', 'delete');
    }
}
