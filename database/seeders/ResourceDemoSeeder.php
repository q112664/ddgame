<?php

namespace Database\Seeders;

use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ResourceDemoSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(ResourceCategoryPresetSeeder::class);

        $categories = ResourceCategory::query()
            ->whereIn('name', $this->categoryNames())
            ->get()
            ->keyBy('name');

        $author = User::query()->firstOrCreate(
            ['email' => 'shionlib-placeholder@example.com'],
            [
                'name' => 'Shionlib 示例导入',
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        );

        foreach ($this->resources() as $resource) {
            $resourceRecord = Resource::query()->firstOrNew([
                'title' => $resource['title'],
            ]);

            $resourceRecord->fill([
                'subtitle' => $resource['subtitle'],
                'thumbnail_path' => $resource['thumbnail_path'],
                'user_id' => $author->id,
                'published_at' => $resource['published_at'],
                'content' => $resource['content'],
            ]);
            $resourceRecord->save();

            $resourceRecord->categories()->sync(
                collect($resource['categories'])
                    ->filter(fn (mixed $categoryName): bool => is_string($categoryName) && filled($categoryName))
                    ->map(fn (string $categoryName): int => $categories[$categoryName]->id)
                    ->all(),
            );

            $resourceRecord->tags()->sync(
                collect($resource['tags'])
                    ->filter(fn (mixed $tagName): bool => is_string($tagName) && filled($tagName))
                    ->map(fn (string $tagName): int => $this->resolveTag($tagName)->id)
                    ->all(),
            );
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    protected function resources(): array
    {
        return [
            [
                'title' => 'パーガトリー・ブルー',
                'subtitle' => 'PURGATORY: BLUE | 近未来科幻视觉小说',
                'thumbnail_path' => $this->thumbnailUrl('game/1089/cover/b20c6425-cf4c-443a-855e-e2912cd05d32.webp'),
                'categories' => ['Galgame', 'PC游戏', '全年龄', '生肉'],
                'tags' => ['Galgame', '近未来', '科幻', '悬疑', '剧情向'],
                'published_at' => '2026-04-01 09:00:00',
                'content' => <<<'HTML'
<p>这是一部以近未来东京湾为舞台的视觉小说，主轴围绕未知能源技术、海上学园与逐步扩大的异常事件展开。</p>
<p>示例详情保留了作品的科幻与悬疑气质，适合作为站内展示“剧情向 Galgame”资源卡片的占位内容。</p>
HTML,
            ],
            [
                'title' => '闇夜のPARENTE 幻燐の姫将軍Remastered',
                'subtitle' => 'Remastered | 黑暗奇幻长篇 ADV',
                'thumbnail_path' => $this->thumbnailUrl('game/11071/cover/ee395a31-a625-4ac8-bf35-8c623bbe6d68.webp'),
                'categories' => ['Galgame', 'PC游戏', 'R18', '生肉'],
                'tags' => ['Galgame', 'R18', '奇幻', '重制版', '长篇'],
                'published_at' => '2026-04-02 09:00:00',
                'content' => <<<'HTML'
<p>这条示例资源以黑暗奇幻世界观为重点，适合放在站内作为重制作品与成人向剧情作的占位条目。</p>
<p>详情文案保留了逃亡、魔族与命运转折这些核心印象，但不直接照录原站介绍。</p>
HTML,
            ],
            [
                'title' => 'ディメンション凸ラバース!!',
                'subtitle' => '怪兽危机 x 学园战斗恋爱 ADV',
                'thumbnail_path' => $this->thumbnailUrl('game/2006/cover/dda16fee-ef3e-486c-a077-2f4342660b73.webp'),
                'categories' => ['Galgame', 'PC游戏', 'R18', '生肉'],
                'tags' => ['Galgame', 'ADV', '学园', '怪兽', '战斗'],
                'published_at' => '2026-04-03 09:00:00',
                'content' => <<<'HTML'
<p>作品设定在怪兽灾厄后的未来学园都市，主打异能组织、校园日常与危机事件并行推进的冒险体验。</p>
<p>这段占位详情更强调题材组合感，适合让资源列表看起来更像真实的站内收录。</p>
HTML,
            ],
            [
                'title' => 'anemoi -アネモイ-',
                'subtitle' => '海边小镇与时间胶囊的青春恋爱故事',
                'thumbnail_path' => $this->thumbnailUrl('game/1114/cover/3d964c07-7c51-472a-aa37-8e022c4d384e.webp'),
                'categories' => ['Galgame', 'PC游戏', '全年龄', '生肉'],
                'tags' => ['Galgame', '全年龄', '青春', '海边', '恋爱'],
                'published_at' => '2026-04-04 09:00:00',
                'content' => <<<'HTML'
<p>这是一部气质偏温柔的青春恋爱作品，围绕重返北方小镇、旧日约定与时间胶囊展开。</p>
<p>详情文字保留了它的怀旧和夏日感，作为首页或分类页的占位示例会很自然。</p>
HTML,
            ],
            [
                'title' => '告别回忆 双想 Break out of my shell',
                'subtitle' => 'Memories Off 9 FD | 恋爱冒险番外篇',
                'thumbnail_path' => $this->thumbnailUrl('game/10662/cover/76ab00d4-c987-4cdf-90a6-041e14f7a1b4.webp'),
                'categories' => ['Galgame', 'PC游戏', '全年龄'],
                'tags' => ['Galgame', '全年龄', 'FD', '校园', '恋爱'],
                'published_at' => '2026-04-05 09:00:00',
                'content' => <<<'HTML'
<p>这条示例资源延续了系列角色后日谈的定位，展示的是主线结束后各位女主角继续向前迈进的生活片段。</p>
<p>用于占位时，它很适合出现在“全年龄”“恋爱”“FD”这些筛选维度里。</p>
HTML,
            ],
            [
                'title' => '哀鸿：城破十日记',
                'subtitle' => 'AVG 文字冒险 | 明末求生与悬疑追索',
                'thumbnail_path' => $this->thumbnailUrl('game/9897/cover/0573d2f9-334f-4f2a-b2ab-6fdbd3fcca10.webp'),
                'categories' => ['Galgame', 'PC游戏', '全年龄'],
                'tags' => ['Galgame', 'AVG', '历史', '悬疑', '剧情向'],
                'published_at' => '2026-04-06 09:00:00',
                'content' => <<<'HTML'
<p>作品以乱世求生为主轴，把十日倒计时、生存选择与真相追查揉进同一条叙事线里。</p>
<p>示例详情保留了“残酷屠城”与“情感回望”这两种反差气质，让资源页看起来更有题材层次。</p>
HTML,
            ],
            [
                'title' => '光翼戦姫エクスティア Marina ～Bright Feather～',
                'subtitle' => 'Bright Feather | 战姬系列后日谈 FD',
                'thumbnail_path' => $this->thumbnailUrl('game/11103/cover/ccadf9f4-906e-4de8-a24b-5794fc58a789.webp'),
                'categories' => ['Galgame', 'PC游戏', 'R18', '生肉'],
                'tags' => ['Galgame', 'R18', 'FD', '战姬', 'Lusterise'],
                'published_at' => '2026-04-07 09:00:00',
                'content' => <<<'HTML'
<p>这是一条偏系列粉丝向的占位示例，重点在于“幸福日常”被来自其他时空的败北分支打破。</p>
<p>它适合承担站内成人向、系列番外与角色主题作品的展示任务。</p>
HTML,
            ],
            [
                'title' => 'リルカは幾重に夜を彩る',
                'subtitle' => '多重人格少女与探侦视角的夜色悬疑',
                'thumbnail_path' => $this->thumbnailUrl('game/10817/cover/a7ec62ef-3941-4414-81b9-bddb2c79f547.webp'),
                'categories' => ['Galgame', 'PC游戏', '全年龄', '生肉'],
                'tags' => ['Galgame', '悬疑', '探侦', '人格', '剧情向'],
                'published_at' => '2026-04-08 09:00:00',
                'content' => <<<'HTML'
<p>这部作品的记忆点来自“拥有复数人格的少女”与“自称探侦的男主”之间逐步展开的夜间调查。</p>
<p>详情做了简洁改写，保留了它偏悬疑、偏人物秘密的观感。</p>
HTML,
            ],
            [
                'title' => '誰ソ彼のシェイプシフター',
                'subtitle' => '理想恋人与异质存在的危险关系',
                'thumbnail_path' => $this->thumbnailUrl('game/1967/cover/e5d3b430-5dac-432c-a1c0-871fee13d0c0.webp'),
                'categories' => ['Galgame', 'PC游戏', '全年龄', '生肉'],
                'tags' => ['Galgame', '心理', '悬疑', '恋爱', '异质存在'],
                'published_at' => '2026-04-09 09:00:00',
                'content' => <<<'HTML'
<p>故事从一段已经结束的关系重新被某种“替代品”接续开始，基调偏心理悬疑与危险恋爱。</p>
<p>作为示例资源，它很适合补足列表里偏黑一点、偏不安一点的题材分布。</p>
HTML,
            ],
            [
                'title' => '甜星姐妹',
                'subtitle' => 'Sweet Starlight Sisters | 兔女郎姐妹养成 ADV',
                'thumbnail_path' => $this->thumbnailUrl('game/10971/cover/d529c7f1-b05b-48ba-94d6-6e1976167fac.webp'),
                'categories' => ['Galgame', 'PC游戏', 'R18', '生肉'],
                'tags' => ['Galgame', '养成', '姐妹', '兔女郎', '恋爱'],
                'published_at' => '2026-04-10 09:00:00',
                'content' => <<<'HTML'
<p>这条示例资源主打轻松甜系的共同生活与养成路线，作品气质比前几条更偏日常陪伴与角色成长。</p>
<p>放进站内以后，可以很好地承担“甜系成人向恋爱作”的占位展示。</p>
HTML,
            ],
        ];
    }

    /**
     * @return list<string>
     */
    protected function categoryNames(): array
    {
        return [
            'Galgame',
            'R18',
            '全年龄',
            '生肉',
            'PC游戏',
        ];
    }

    protected function resolveTag(string $tagName): Tag
    {
        $slug = Str::slug($tagName);

        if (blank($slug)) {
            $slug = 'tag-'.substr(md5($tagName), 0, 10);
        }

        return Tag::query()->firstOrCreate(
            ['slug' => $slug],
            ['name' => $tagName],
        );
    }

    protected function thumbnailUrl(string $path): string
    {
        return 'https://t.shionlib.com/'.$path;
    }
}
