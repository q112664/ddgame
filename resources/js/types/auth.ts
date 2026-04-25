export type User = {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    signature: string | null;
    can_access_admin_panel: boolean;
    email_verified_at: string | null;
};

export type Auth = {
    user: User | null;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
