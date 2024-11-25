import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpHelper {

    constructor(private http: HttpClient) { }

    /**
     * Send a post request to api
     * @param url
     * @param data
     */
    async post(url: string, data: any) {
        return await this.http.post<any>(environment.api_server + '/' + url, data).toPromise();
    }

    /**
     * Send a put request to api
     * @param url
     * @param data
     */
    async put(url: string, data: any) {
        return await this.http.put<any>(environment.api_server + '/' + url, data).toPromise();
    }

    /**
     * Send a get request to api
     * @param url
     */
    async get(url: string) {
        return await this.http.get<any>(environment.api_server + '/' + url).toPromise();
    }

    /**
     * Send a delete request to api
     * @param url
     */
    async delete(url: string) {
        return await this.http.delete<any>(environment.api_server + '/' + url).toPromise();
    }
}