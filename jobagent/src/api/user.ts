import { IInterviewResumeDetail } from '@/types/IInterview';
import { fetchApi, fetchApiWithFile } from './config';
import { IUser, IUserFile, IUserRegister } from '@/types/IUser';

export async function uploadCV(file: File): Promise<IUserFile> {
    const formData = new FormData();
    formData.append('file', file);
    return fetchApiWithFile<IUserFile>('/users/cv', {
        method: 'POST',
        body: formData,
        public: false,
    });
}

export async function uploadDocx(file: File): Promise<IUserFile> {
    const formData = new FormData();
    formData.append('file', file);
    return fetchApiWithFile<IUserFile>('/users/docx', {
        method: 'POST',
        body: formData,
        public: false,
    });
}

export async function getInterviewHistory(): Promise<IInterviewResumeDetail[]> {
    return fetchApi<IInterviewResumeDetail[]>('/users/interviews', {
        method: 'GET',
        public: false,
    });
}

export async function getUser(): Promise<IUser> {
    return fetchApi<IUser>('/users/me', {
        method: 'GET',
        public: false,
    });
}

export async function register(user: IUserRegister): Promise<void> {
    return fetchApi<void>('/users/register', {
        method: 'POST',
        public: false,
        body: JSON.stringify(user),
    });
}

