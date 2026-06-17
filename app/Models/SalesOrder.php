<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesOrder extends Model
{
    use HasFactory, Auditable;

    protected $fillable = [
        'reference',
        'customer_name',
        'status', // Draft, Confirmed, Dispatched, Completed, Cancelled
        'order_date',
        'dispatch_date',
        'created_by'
    ];

    public function items()
    {
        return $this->hasMany(SalesOrderItem::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
