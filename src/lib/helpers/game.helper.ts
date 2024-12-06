import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameHelper {

    /**
     * List of games
     */
    private games = [
        {
            id: 'alpha-roller',
            name: 'Alpha Roller',
            icon: 'fas fa-random',
            color: '#8e44ad',
            description: 'Roll your way through the alphabet guessing highs and lows',
        },
        {
            id: 'spell-seeker',
            name: 'Spell Seeker',
            icon: 'fas fa-binoculars',
            color: '#e67e22',
            description: 'Uncover the hidden word by searching for the missing letters',
        },
    ];

    /**
     * Get a list of games
     */
    list() {
        return this.games;
    }

    /**
     * Find game
     *
     * @param id
     */
    find(id: string): any {
        return this.games.find(g => g.id == id);
    }
}