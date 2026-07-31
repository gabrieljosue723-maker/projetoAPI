<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('produtos', function (Blueprint $table) {
            $table->string('telefone', 20)->nullable()->after('preco');
            $table->string('whatsapp', 20)->nullable()->after('telefone');
            $table->string('facebook', 255)->nullable()->after('whatsapp');
        });
    }

    public function down(): void
    {
        Schema::table('produtos', function (Blueprint $table) {
            $table->dropColumn(['telefone', 'whatsapp', 'facebook']);
        });
    }
};