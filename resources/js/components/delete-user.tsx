import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <section className="space-y-6 pt-8">
            <Heading
                variant="small"
                title="删除账号"
                description="删除你的账号以及与之关联的所有数据"
            />
            <div className="space-y-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <div className="relative space-y-0.5 text-destructive">
                    <p className="font-medium">警告</p>
                    <p className="text-sm text-foreground/80">
                        此操作无法撤销，请谨慎继续。
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            data-test="delete-user-button"
                        >
                            删除账号
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>
                            你确定要删除账号吗？
                        </DialogTitle>
                        <DialogDescription>
                            账号删除后，相关资源和数据也会被永久移除。请输入当前密码以确认你要永久删除此账号。
                        </DialogDescription>

                        <Form
                            action="/settings/profile"
                            method="post"
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <input
                                        type="hidden"
                                        name="_method"
                                        value="delete"
                                    />

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            密码
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="请输入当前密码"
                                            autoComplete="current-password"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                取消
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={processing}
                                            asChild
                                        >
                                            <button
                                                type="submit"
                                                data-test="confirm-delete-user-button"
                                            >
                                                删除账号
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
}
