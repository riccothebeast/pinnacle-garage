<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name', 'brand', 'price', 'description', 'image', 'stock', 'year', 'model'
    ];
}
