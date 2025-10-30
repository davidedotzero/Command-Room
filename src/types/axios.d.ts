import 'axios';

declare module 'axios' {
    export interface AxiosRequestConfig {
        alert?: boolean;
    }
}
