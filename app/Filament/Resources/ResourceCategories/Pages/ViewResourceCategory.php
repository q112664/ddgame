<?php

namespace App\Filament\Resources\ResourceCategories\Pages;

use App\Filament\Resources\ResourceCategories\ResourceCategoryResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewResourceCategory extends ViewRecord
{
    protected static string $resource = ResourceCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
