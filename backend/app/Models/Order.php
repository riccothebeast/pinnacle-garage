<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_email', 'user_phone', 'total_amount', 'status'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
