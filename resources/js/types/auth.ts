export type User = {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
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
