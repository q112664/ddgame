// Components
import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes/index';
import { send } from '@/routes/verification/index';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="邮箱验证" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    新的验证链接已经发送到你注册时填写的邮箱。
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}
                            重新发送验证邮件
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm"
                        >
                            退出登录
                        </TextLink>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: '验证邮箱',
    description: '请点击刚刚发送到你邮箱中的验证链接完成验证。',
};
