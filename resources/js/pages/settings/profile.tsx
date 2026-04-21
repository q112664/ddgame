import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInitials } from '@/hooks/use-initials';
import { send } from '@/routes/verification/index';
import type { User } from '@/types';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const {
        auth: { user },
    } = usePage<{ auth: { user: User } }>().props;
    const getInitials = useInitials();
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [selectedAvatarPreview, setSelectedAvatarPreview] = useState<
        string | null
    >(null);
    const [selectedAvatarName, setSelectedAvatarName] = useState<string | null>(
        null,
    );
    const avatarPreview = selectedAvatarPreview ?? user.avatar;

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file === undefined) {
            setSelectedAvatarPreview(null);
            setSelectedAvatarName(null);

            return;
        }

        setSelectedAvatarName(file.name);
        setSelectedAvatarPreview(URL.createObjectURL(file));
    };

    useEffect(() => {
        if (selectedAvatarPreview === null) {
            return;
        }

        return () => {
            URL.revokeObjectURL(selectedAvatarPreview);
        };
    }, [selectedAvatarPreview]);

    const clearSelectedAvatar = () => {
        setSelectedAvatarPreview(null);
        setSelectedAvatarName(null);

        if (avatarInputRef.current !== null) {
            avatarInputRef.current.value = '';
        }
    };

    return (
        <>
            <Head title="个人资料" />

            <h1 className="sr-only">个人资料设置</h1>

            <div className="space-y-8">
                <Heading
                    variant="small"
                    title="个人资料"
                    description="更新你的昵称、邮箱以及基础账号信息。"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    onSuccess={clearSelectedAvatar}
                    encType="multipart/form-data"
                    className="space-y-6"
                >
                    {({ processing, recentlySuccessful, errors }) => (
                        <>
                            <div className="grid gap-3">
                                <Label htmlFor="avatar">头像</Label>

                                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                    <Avatar className="!size-[72px] bg-muted sm:!size-20">
                                        <AvatarImage
                                            src={avatarPreview ?? undefined}
                                            alt={user.name}
                                        />
                                        <AvatarFallback className="text-base font-medium">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex min-h-[72px] flex-1 flex-col justify-center gap-3 sm:min-h-20">
                                        <input
                                            ref={avatarInputRef}
                                            id="avatar"
                                            type="file"
                                            name="avatar"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />

                                        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-9 rounded-md border-border/80 bg-background px-3.5 shadow-none hover:bg-muted"
                                                onClick={() =>
                                                    avatarInputRef.current?.click()
                                                }
                                            >
                                                更换头像
                                            </Button>

                                            <span className="text-sm text-muted-foreground">
                                                {selectedAvatarName ??
                                                    '未选择新文件'}
                                            </span>
                                        </div>

                                        <p className="text-sm leading-6 text-muted-foreground">
                                            支持 JPG、PNG、WEBP
                                            等常见图片格式，单张不超过 2MB。
                                        </p>
                                    </div>
                                </div>

                                <InputError message={errors.avatar} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">昵称</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="请输入昵称"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">邮箱地址</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="请输入邮箱地址"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="signature">签名</Label>

                                <textarea
                                    id="signature"
                                    name="signature"
                                    defaultValue={user.signature ?? ''}
                                    rows={4}
                                    maxLength={280}
                                    placeholder="写一句能代表你的签名吧"
                                    className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                                />

                                <p className="text-sm text-muted-foreground">
                                    最多 280
                                    个字符，会展示在你的个人信息资料卡中。
                                </p>

                                <InputError
                                    className="mt-2"
                                    message={errors.signature}
                                />
                            </div>

                            {mustVerifyEmail &&
                                user.email_verified_at === null && (
                                    <div className="rounded-xl border border-border bg-muted/50 p-4">
                                        <p className="text-sm text-muted-foreground">
                                            你的邮箱地址尚未验证。{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-border underline-offset-4 transition-colors duration-300 ease-out hover:text-primary"
                                            >
                                                点击这里重新发送验证邮件。
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-primary">
                                                新的验证链接已经发送到你的邮箱。
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    保存
                                </Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-muted-foreground">
                                        已保存
                                    </p>
                                </Transition>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}
