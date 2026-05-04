export type ILoginPayload = {
    email: string;
    password:  string;
}

export type IRegisterPayload = {
    name: string;
    email: string;
    password:  string;
    phone?: string;
    image?: string;
}
