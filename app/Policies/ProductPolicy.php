<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Product;

class ProductPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermission('catalog', 'view');
    }

    public function view(User $user, Product $product)
    {
        return $user->hasPermission('catalog', 'view');
    }

    public function create(User $user)
    {
        return $user->hasPermission('catalog', 'create');
    }

    public function update(User $user, Product $product)
    {
        return $user->hasPermission('catalog', 'edit');
    }

    public function delete(User $user, Product $product)
    {
        return $user->hasPermission('catalog', 'delete');
    }

    public function restore(User $user, Product $product)
    {
        return $user->hasPermission('catalog', 'edit');
    }

    public function forceDelete(User $user, Product $product)
    {
        return $user->hasPermission('catalog', 'delete');
    }
}
