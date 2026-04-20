<?php

use App\Filament\Pages\LogoSettings as LogoSettingsPage;
use App\Filament\Pages\NavigationSettings as NavigationSettingsPage;
use App\Filament\Pages\SiteSettings as SiteSettingsPage;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Livewire\Livewire;

test('admin can render the split site settings pages', function () {
    $admin = User::factory()->create([
        'email' => 'admin@admin.com',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($admin)
        ->get(SiteSettingsPage::getUrl(panel: 'admin'))
        ->assertOk()
        ->assertSee('站点地址')
        ->assertDontSee('Logo 图片')
        ->assertDontSee('菜单项');

    $this->actingAs($admin)
        ->get(LogoSettingsPage::getUrl(panel: 'admin'))
        ->assertOk()
        ->assertSee('Logo 设置')
        ->assertSee('Logo 文字')
        ->assertSee('Logo 图片')
        ->assertDontSee('菜单项');

    $this->actingAs($admin)
        ->get(NavigationSettingsPage::getUrl(panel: 'admin'))
        ->assertOk()
        ->assertSee('导航菜单')
        ->assertSee('菜单项')
        ->assertDontSee('Logo 图片');
});

test('site settings shared returns default primary navigation when unconfigured', function () {
    expect(SiteSetting::shared()['navigation']['primary'])->toBe([
        [
            'label' => '概览',
            'url' => '/#overview',
            'openInNewTab' => false,
        ],
        [
            'label' => '系统',
            'url' => '/#systems',
            'openInNewTab' => false,
        ],
        [
            'label' => '状态',
            'url' => '/#status',
            'openInNewTab' => false,
        ],
    ]);
});

test('shared inertia props expose saved site settings', function () {
    Storage::fake('public');

    $logoPath = UploadedFile::fake()->image('logo.png')->store('site-settings/logos', 'public');

    SiteSetting::query()->create([
        'site_url' => 'https://example.com',
        'logo_text' => 'DDGAME',
        'logo_path' => $logoPath,
        'primary_navigation' => [
            [
                'label' => '',
                'url' => '/discard-me',
                'open_in_new_tab' => false,
                'sort_order' => 1,
            ],
            [
                'label' => '外链',
                'url' => 'https://docs.example.com',
                'open_in_new_tab' => true,
                'sort_order' => 3,
            ],
            [
                'label' => '首页概览',
                'url' => '/#overview',
                'open_in_new_tab' => false,
                'sort_order' => 2,
            ],
        ],
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->where('name', 'DDGAME')
            ->where('site.name', 'DDGAME')
            ->where('site.url', 'https://example.com')
            ->where('site.logo', asset('storage/'.$logoPath))
            ->has('site.navigation.primary', 2)
            ->where('site.navigation.primary.0.label', '首页概览')
            ->where('site.navigation.primary.0.url', '/#overview')
            ->where('site.navigation.primary.0.openInNewTab', false)
            ->where('site.navigation.primary.1.label', '外链')
            ->where('site.navigation.primary.1.url', 'https://docs.example.com')
            ->where('site.navigation.primary.1.openInNewTab', true)
        );
});

test('split settings forms are filled from the saved singleton record', function () {
    Storage::fake('public');

    $admin = User::factory()->create([
        'email' => 'admin@admin.com',
        'email_verified_at' => now(),
    ]);

    $logoPath = UploadedFile::fake()->image('logo.png')->store('site-settings/logos', 'public');

    SiteSetting::query()->create([
        'id' => 1,
        'site_url' => 'https://example.com',
        'logo_text' => 'DDGAME',
        'logo_path' => $logoPath,
        'primary_navigation' => [
            [
                'label' => '首页概览',
                'url' => '/#overview',
                'open_in_new_tab' => false,
                'sort_order' => 1,
            ],
            [
                'label' => '外链',
                'url' => 'https://docs.example.com',
                'open_in_new_tab' => true,
                'sort_order' => 2,
            ],
        ],
    ]);

    $this->actingAs($admin);

    Livewire::test(SiteSettingsPage::class)
        ->assertSet('data.site_url', 'https://example.com');

    Livewire::test(LogoSettingsPage::class)
        ->assertSet('data.logo_text', 'DDGAME')
        ->assertSet('data.logo_path', fn ($state): bool => is_array($state)
            && in_array($logoPath, $state, true));

    Livewire::test(NavigationSettingsPage::class)
        ->assertSet('data.primary_navigation', fn ($state): bool => collect($state)
            ->values()
            ->pluck('label')
            ->all() === ['首页概览', '外链']
            && collect($state)->values()->pluck('url')->all() === [
                '/#overview',
                'https://docs.example.com',
            ]
            && collect($state)->values()->pluck('open_in_new_tab')->all() === [
                false,
                true,
            ]);
});
