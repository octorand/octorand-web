import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BadgeHelper {

    badges = [
        {
            id: 'artifact',
            name: 'Artifact',
            icon: 'fas fa-star',
        },
        {
            id: 'bountiful',
            name: 'Bountiful',
            icon: 'fas fa-coins',
        },
        {
            id: 'chameleon',
            name: 'Chameleon',
            icon: 'fas fa-mask',
        },
        {
            id: 'changeling',
            name: 'Changeling',
            icon: 'fas fa-yin-yang',
        },
        {
            id: 'culture',
            name: 'Culture',
            icon: 'fas fa-heart',
        },
        {
            id: 'drained',
            name: 'Drained',
            icon: 'fas fa-tint-slash',
        },
        {
            id: 'equidistant',
            name: 'Equidistant',
            icon: 'fas fa-snowflake',
        },
        {
            id: 'exotic',
            name: 'Exotic',
            icon: 'fas fa-cocktail',
        },
        {
            id: 'explorer',
            name: 'Explorer',
            icon: 'fas fa-rocket',
        },
        {
            id: 'family',
            name: 'Family',
            icon: 'fas fa-users',
        },
        {
            id: 'fancy',
            name: 'Fancy',
            icon: 'fas fa-rainbow',
        },
        {
            id: 'fiction',
            name: 'Fiction',
            icon: 'fas fa-jedi',
        },
        {
            id: 'flipper',
            name: 'Flipper',
            icon: 'fas fa-drafting-compass',
        },
        {
            id: 'founder',
            name: 'Founder',
            icon: 'fas fa-robot',
        },
        {
            id: 'phrase',
            name: 'Phrase',
            icon: 'fas fa-pen-nib',
        },
        {
            id: 'pioneer',
            name: 'Pioneer',
            icon: 'fas fa-user-astronaut',
        },
        {
            id: 'pristine',
            name: 'Pristine',
            icon: 'fas fa-soap',
        },
        {
            id: 'shapeshifter',
            name: 'Shapeshifter',
            icon: 'fas fa-theater-masks',
        },
        {
            id: 'straight',
            name: 'Straight',
            icon: 'fas fa-bars',
        },
        {
            id: 'wordsmith',
            name: 'Wordsmith',
            icon: 'fas fa-book',
        },
    ];

    /**
     * Get a list of badges
     */
    list() {
        return this.badges;
    }
}