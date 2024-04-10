<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'image_path',
        'name',
        'description',
        'price',
        'quantity',
    ];


    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
