import { Link, router } from '@inertiajs/react';
import {
    CircleUserRound,
    LayoutDashboard,
    LogOut,
    Settings,
} from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { dashboard as adminDashboard } from '@/routes/filament/admin/pages/index';
import { logout } from '@/routes/index';
import { edit } from '@/routes/profile/index';
import { show as showUserProfile } from '@/routes/users/index';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                {user.email === 'admin@admin.com' && (
                    <DropdownMenuItem asChild>
                        <a
                            className="block w-full cursor-pointer"
                            href={adminDashboard.url()}
                            onClick={cleanup}
                        >
                            <LayoutDashboard className="mr-2" />
                            后台管理
                        </a>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={showUserProfile({ user: user.id })}
                        prefetch
                        onClick={cleanup}
                    >
                        <CircleUserRound className="mr-2" />
                        个人信息
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2" />
                        账号设置
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    退出登录
                </Link>
            </DropdownMenuItem>
        </>
    );
}
