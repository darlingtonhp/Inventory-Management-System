<?php

namespace App\Policies;

use App\Models\User;
use App\Models\PurchaseOrder;

class PurchaseOrderPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermission('purchasing', 'view');
    }

    public function view(User $user, PurchaseOrder $purchaseOrder)
    {
        return $user->hasPermission('purchasing', 'view');
    }

    public function create(User $user)
    {
        return $user->hasPermission('purchasing', 'create');
    }

    public function update(User $user, PurchaseOrder $purchaseOrder)
    {
        return $user->hasPermission('purchasing', 'edit');
    }

    public function delete(User $user, PurchaseOrder $purchaseOrder)
    {
        return $user->hasPermission('purchasing', 'delete');
    }
}
