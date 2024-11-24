import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameHelper {

    /**
     * List of games
     */
    private games = [
        {
            id: 'spell-seeker',
            name: 'Spell Seeker',
            icon: 'fas fa-binoculars',
            description: 'Uncover the hidden word by searching for the missing letters',
        },
    ];

    /**
     * Get a list of games
     */
    list() {
        return this.games;
    }
}