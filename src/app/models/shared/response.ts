export interface Response<T> {
    isSuccess: boolean;
    code: number;
    message: string;
    isFailure: boolean;
    data: T[]; 
}