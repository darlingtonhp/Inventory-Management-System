<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::before(function ($user, $ability) {
            if ($user->role && $user->role->slug === 'admin') {
                return true;
            }
        });

        Gate::define('check-permission', function ($user, $module, $action) {
            return $user->hasPermission($module, $action);
        });
    }
}
