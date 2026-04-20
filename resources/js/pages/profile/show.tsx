import { Head, usePage } from '@inertiajs/react';
import { CalendarDays, Heart, ShieldCheck, SquarePen } from 'lucide-react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

type ProfileSummary = {
    joinedAt: string | null;
    level: string;
};

type ProfileStat = {
    label: string;
    value: number;
};

export default function ProfileShow({
    profile,
    stats,
}: {
    profile: ProfileSummary;
    stats: ProfileStat[];
}) {
    const {
        auth: { user },
    } = usePage<{ auth: { user: User } }>().props;
    const getInitials = useInitials();

    return (
        <>
            <Head title="个人信息" />

            <div>
                <div className="overflow-hidden rounded-xl border border-border/80 bg-card text-card-foreground shadow-xs ring-1 ring-foreground/10">
                    <div className="flex flex-col items-center gap-3.5 px-4 py-4 text-center sm:flex-row sm:items-center sm:gap-5 sm:px-6 sm:py-5 sm:text-left">
                        <Avatar className="size-16 shrink-0 bg-muted sm:size-20">
                            <AvatarImage
                                src={user.avatar ?? undefined}
                                alt={user.name}
                            />
                            <AvatarFallback className="text-base font-medium">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 w-full space-y-2.5">
                            <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                                    <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                                        {user.name}
                                    </h2>
                                    <Badge
                                        variant="secondary"
                                        className="rounded-full px-2"
                                    >
                                        {profile.level}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-2.5 text-sm text-muted-foreground sm:justify-start">
                                <div className="inline-flex items-center gap-2 rounded-full bg-muted/70 px-2.5 py-1.25">
                                    <CalendarDays className="size-4" />
                                    <span>
                                        加入时间
                                        {profile.joinedAt === null
                                            ? ' 暂无记录'
                                            : ` ${profile.joinedAt}`}
                                    </span>
                                </div>

                                <div className="inline-flex items-center gap-2 rounded-full bg-muted/70 px-2.5 py-1.25">
                                    <ShieldCheck className="size-4" />
                                    <span>用户等级 {profile.level}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-xl border border-border/80 bg-card px-4 py-3 shadow-xs ring-1 ring-foreground/10 sm:px-5"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">
                                        {stat.label}
                                    </p>
                                    <p className="text-2xl font-semibold tracking-tight text-foreground">
                                        {stat.value}
                                    </p>
                                </div>

                                <div className="flex size-10 items-center justify-center rounded-full bg-muted/70 text-muted-foreground">
                                    {stat.label === '投稿数量' ? (
                                        <SquarePen className="size-4.5" />
                                    ) : (
                                        <Heart className="size-4.5" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
