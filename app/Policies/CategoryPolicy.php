<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Category;

class CategoryPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermission('catalog', 'view');
    }

    public function view(User $user, Category $category)
    {
        return $user->hasPermission('catalog', 'view');
    }

    public function create(User $user)
    {
        return $user->hasPermission('catalog', 'create');
    }

    public function update(User $user, Category $category)
    {
        return $user->hasPermission('catalog', 'edit');
    }

    public function delete(User $user, Category $category)
    {
        return $user->hasPermission('catalog', 'delete');
    }
}
