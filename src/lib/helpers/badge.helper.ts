import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BadgeHelper {

    /**
     * List of badges
     */
    private badges = [
        {
            id: 'artifact',
            name: 'Artifact',
            icon: 'fas fa-star',
            description: 'Primes that have made significant impacts in Octorand',
        },
        {
            id: 'bountiful',
            name: 'Bountiful',
            icon: 'fas fa-coins',
            description: 'Primes that have never been harvested for OCTO rewards',
        },
        {
            id: 'chameleon',
            name: 'Chameleon',
            icon: 'fas fa-mask',
            description: 'Primes that have undergone at least 100 transformations',
        },
        {
            id: 'changeling',
            name: 'Changeling',
            icon: 'fas fa-yin-yang',
            description: 'Primes that have undergone at least 25 transformations',
        },
        {
            id: 'culture',
            name: 'Culture',
            icon: 'fas fa-heart',
            description: 'Primes whose names spell out a cultural reference',
        },
        {
            id: 'drained',
            name: 'Drained',
            icon: 'fas fa-tint-slash',
            description: 'Primes that no longer contain any OCTO to be harvested',
        },
        {
            id: 'equidistant',
            name: 'Equidistant',
            icon: 'fas fa-snowflake',
            description: 'Primes with names composed of identical letters',
        },
        {
            id: 'exotic',
            name: 'Exotic',
            icon: 'fas fa-cocktail',
            description: 'Primes that have been traded in the market at least 10 times',
        },
        {
            id: 'explorer',
            name: 'Explorer',
            icon: 'fas fa-rocket',
            description: 'Primes that are upgraded to the latest version',
        },
        {
            id: 'family',
            name: 'Family',
            icon: 'fas fa-users',
            description: 'Primes where both parent and offsprings belong to the same owner',
        },
        {
            id: 'fancy',
            name: 'Fancy',
            icon: 'fas fa-rainbow',
            description: 'Primes with names featuring special patterns like zigzags',
        },
        {
            id: 'fiction',
            name: 'Fiction',
            icon: 'fas fa-jedi',
            description: 'Primes whose names spell words from fictional literature',
        },
        {
            id: 'flipper',
            name: 'Flipper',
            icon: 'fas fa-drafting-compass',
            description: 'Primes that have been traded in the market at least 5 times',
        },
        {
            id: 'founder',
            name: 'Founder',
            icon: 'fas fa-robot',
            description: 'Primes originally owned by the developer',
        },
        {
            id: 'phrase',
            name: 'Phrase',
            icon: 'fas fa-pen-nib',
            description: 'Primes whose names form a complete English sentence',
        },
        {
            id: 'pioneer',
            name: 'Pioneer',
            icon: 'fas fa-user-astronaut',
            description: 'Primes that led the way in transformation techniques',
        },
        {
            id: 'pristine',
            name: 'Pristine',
            icon: 'fas fa-soap',
            description: 'Primes that retain their original names without any changes',
        },
        {
            id: 'shapeshifter',
            name: 'Shapeshifter',
            icon: 'fas fa-theater-masks',
            description: 'Primes that have undergone at least 50 transformations',
        },
        {
            id: 'straight',
            name: 'Straight',
            icon: 'fas fa-bars',
            description: 'Primes whose names are in alphabetical order without any gaps',
        },
        {
            id: 'wordsmith',
            name: 'Wordsmith',
            icon: 'fas fa-book',
            description: 'Primes whose names spell proper English words',
        },
    ];

    /**
     * Get a list of badges
     */
    list() {
        return this.badges;
    }
}