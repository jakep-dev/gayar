export interface ResponseModel {
    code: number;
    message: string;
}

export interface KeyValuePair<T> {
    key: string;
    value: T;
}
