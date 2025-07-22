

export type MenuItem = {
    id: number;
    name: string;
    icon: React.ReactNode | null | undefined;
    path: string;
    children: MenuItem[] | null | undefined;
    is_active: boolean | null | undefined;
}

