const AUTH_STATUS_MESSAGES: Record<string, string> = {
    'passwords.sent': '我们已经向你的邮箱发送了重置密码链接。',
    'passwords.reset': '你的密码已经重置成功，请使用新密码登录。',
    'We have emailed your password reset link.':
        '我们已经向你的邮箱发送了重置密码链接。',
    'Your password has been reset.': '你的密码已经重置成功，请使用新密码登录。',
};

export function translateAuthStatus(status?: string): string | undefined {
    if (!status) {
        return undefined;
    }

    return AUTH_STATUS_MESSAGES[status] ?? status;
}
