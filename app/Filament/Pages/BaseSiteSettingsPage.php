<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting as SiteSettingModel;
use Filament\Actions\Action;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Concerns\InteractsWithFormActions;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

abstract class BaseSiteSettingsPage extends Page implements HasForms
{
    use InteractsWithFormActions;
    use InteractsWithForms;

    protected static string|UnitEnum|null $navigationGroup = '系统';

    protected string $view = 'filament.pages.site-settings';

    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    public ?SiteSettingModel $record = null;

    public function mount(): void
    {
        $this->record = SiteSettingModel::singleton();

        $this->fillForm();
    }

    protected function fillForm(): void
    {
        $settings = $this->record ?? SiteSettingModel::singleton();

        $this->form->fill($this->getFillData($settings));
    }

    /**
     * @return array<string, mixed>
     */
    abstract protected function getFillData(SiteSettingModel $settings): array;

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    abstract protected function mutateSaveData(array $data, SiteSettingModel $settings): array;

    abstract protected function getSavedNotificationTitle(): string;

    protected function afterSave(SiteSettingModel $previous, SiteSettingModel $current): void {}

    public function save(): void
    {
        $settings = $this->record ?? SiteSettingModel::singleton();
        $previous = clone $settings;
        $data = $this->form->getState();

        $settings->fill($this->mutateSaveData($data, $settings));
        $settings->save();

        $this->record = $settings->fresh();
        $this->fillForm();
        $this->afterSave($previous, $this->record);

        Notification::make()
            ->title($this->getSavedNotificationTitle())
            ->success()
            ->send();
    }

    public function content(Schema $schema): Schema
    {
        return $schema
            ->components([
                Form::make([EmbeddedSchema::make('form')])
                    ->id('form')
                    ->livewireSubmitHandler('save')
                    ->footer([
                        Actions::make($this->getFormActions())
                            ->fullWidth(false),
                    ]),
            ]);
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('保存设置')
                ->submit('save')
                ->keyBindings(['mod+s']),
        ];
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('openSite')
                ->label('打开站点')
                ->icon(Heroicon::OutlinedArrowTopRightOnSquare)
                ->color('gray')
                ->url(fn (): string => SiteSettingModel::shared()['url'])
                ->openUrlInNewTab(),
        ];
    }
}
