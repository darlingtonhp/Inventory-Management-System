<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

trait Auditable
{
    public static function bootAuditable()
    {
        static::created(function ($model) {
            self::logActivity('Created', null, $model->getAttributes(), $model);
        });

        static::updated(function ($model) {
            $old = [];
            $new = [];
            foreach ($model->getDirty() as $key => $value) {
                $old[$key] = $model->getOriginal($key);
                $new[$key] = $value;
            }
            self::logActivity('Updated', $old, $new, $model);
        });

        static::deleted(function ($model) {
            self::logActivity('Deleted', $model->getAttributes(), null, $model);
        });
    }

    protected static function logActivity($action, $oldValues, $newValues, $model)
    {
        // Avoid auditing the AuditLog itself to prevent infinite loops (though AuditLog doesn't use the trait)
        if ($model instanceof AuditLog) {
            return;
        }

        try {
            AuditLog::create([
                'user_id' => Auth::check() ? Auth::id() : null,
                'action' => $action . ' ' . class_basename($model),
                'model_type' => get_class($model),
                'model_id' => $model->getKey(),
                'old_values' => $oldValues,
                'new_values' => $newValues,
                'ip_address' => request()->ip()
            ]);
        } catch (\Exception $e) {
            // Silently fail so we don't break application logic if auditing fails
            logger()->error('Audit Logging failed: ' . $e->getMessage());
        }
    }
}
