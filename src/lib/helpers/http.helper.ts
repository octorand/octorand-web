import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppHelper } from './app.helper';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpHelper {

    /**
     * Construct component
     *
     * @param appHelper
     * @param http
     */
    constructor(
        private appHelper: AppHelper,
        private http: HttpClient
    ) { }

    /**
     * Send a post request to api
     *
     * @param url
     * @param data
     * @param auth
     */
    async post(url: string, data: any, auth: boolean) {
        let headers = this.headers(auth);
        return await this.http.post<any>(environment.api_server + '/' + url, data, { headers: headers }).toPromise();
    }

    /**
     * Send a put request to api
     *
     * @param url
     * @param data
     * @param auth
     */
    async put(url: string, data: any, auth: boolean) {
        let headers = this.headers(auth);
        return await this.http.put<any>(environment.api_server + '/' + url, data, { headers: headers }).toPromise();
    }

    /**
     * Send a get request to api
     *
     * @param url
     * @param auth
     */
    async get(url: string, auth: boolean) {
        let headers = this.headers(auth);
        return await this.http.get<any>(environment.api_server + '/' + url, { headers: headers }).toPromise();
    }

    /**
     * Send a delete request to api
     *
     * @param url
     * @param auth
     */
    async delete(url: string, auth: boolean) {
        let headers = this.headers(auth);
        return await this.http.delete<any>(environment.api_server + '/' + url, { headers: headers }).toPromise();
    }

    /**
     * Determine headers to be sent
     *
     * @param auth
     */
    headers(auth: boolean): HttpHeaders {
        let headers = new HttpHeaders();
        if (auth) {
            const account = this.appHelper.getAccount();
            if (account) {
                headers.append('Authorization', 'Bearer ' + account.token);
            }
        }

        console.log(headers);

        return headers;
    }
}