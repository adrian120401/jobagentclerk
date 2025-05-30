export interface IUser {
    id: string;
    name: string;
    email: string;
    docx_path: string;
}

export interface LoginResponse {
    user: IUser;
    token: string;
}

export interface IUserRegister {
    name: string;
    email: string;
    clerkId: string;
}

export interface IUserFile {
    url: string;
}