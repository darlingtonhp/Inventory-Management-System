<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Reports are generated dynamically; database table not required.
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
