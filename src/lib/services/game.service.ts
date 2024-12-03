import { Injectable } from '@angular/core';
import { HttpHelper } from '@lib/helpers';

@Injectable({ providedIn: 'root' })
export class GameService {

    /**
     * Construct component
     *
     * @param httpHelper
     */
    constructor(
        private httpHelper: HttpHelper
    ) { }

    /**
     * Load game details
     *
     * @param game
     */
    async load(game: string) {
        const body = { game: game };
        return await this.httpHelper.post('game/load', body, true);
    }

    /**
     * Process game action
     *
     * @param game
     * @param action
     * @param data
     */
    async process(game: string, action: string, data: any) {
        const body = { game: game, action: action, data: data };
        return await this.httpHelper.post('game/process', body, true);
    }
}