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
            description: 'Primes that have made some special contributions in the early days of Octorand',
        },
        {
            id: 'bountiful',
            name: 'Bountiful',
            icon: 'fas fa-coins',
            description: 'Primes that have never been harvested for OCTO',
        },
        {
            id: 'chameleon',
            name: 'Chameleon',
            icon: 'fas fa-mask',
            description: 'Primes that have gone through at least 100 transformations',
        },
        {
            id: 'changeling',
            name: 'Changeling',
            icon: 'fas fa-yin-yang',
            description: 'Primes that have gone through at least 25 transformations',
        },
        {
            id: 'culture',
            name: 'Culture',
            icon: 'fas fa-heart',
            description: 'Primes whose traits spell a word that has some reference to certain cultures',
        },
        {
            id: 'drained',
            name: 'Drained',
            icon: 'fas fa-tint-slash',
            description: 'Primes that have no more OCTO inside them to be minted',
        },
        {
            id: 'equidistant',
            name: 'Equidistant',
            icon: 'fas fa-snowflake',
            description: 'Primes whose name letters are all the same',
        },
        {
            id: 'exotic',
            name: 'Exotic',
            icon: 'fas fa-cocktail',
            description: 'Primes that have been traded in the marketplace at least 10 times',
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
            description: 'Primes where both parent and children belong to the same owner',
        },
        {
            id: 'fancy',
            name: 'Fancy',
            icon: 'fas fa-rainbow',
            description: 'Primes that have special pattern traits like zigzags or palindromes',
        },
        {
            id: 'fiction',
            name: 'Fiction',
            icon: 'fas fa-jedi',
            description: 'Primes whose traits spell a fictional word from books, comics, movies, etc',
        },
        {
            id: 'flipper',
            name: 'Flipper',
            icon: 'fas fa-drafting-compass',
            description: 'Primes that have been traded in the marketplace at least 5 times',
        },
        {
            id: 'founder',
            name: 'Founder',
            icon: 'fas fa-robot',
            description: 'Primes that have been owned by the developer originally',
        },
        {
            id: 'phrase',
            name: 'Phrase',
            icon: 'fas fa-pen-nib',
            description: 'Primes whose name spell a English sentence',
        },
        {
            id: 'pioneer',
            name: 'Pioneer',
            icon: 'fas fa-user-astronaut',
            description: 'Primes that went through transformations before OCTO token finished emiting',
        },
        {
            id: 'pristine',
            name: 'Pristine',
            icon: 'fas fa-soap',
            description: 'Primes that still have their original name without any changes',
        },
        {
            id: 'shapeshifter',
            name: 'Shapeshifter',
            icon: 'fas fa-theater-masks',
            description: 'Primes that have gone through at least 50 transformations',
        },
        {
            id: 'straight',
            name: 'Straight',
            icon: 'fas fa-bars',
            description: 'Primes whose name is in alphabetical order with no gaps',
        },
        {
            id: 'wordsmith',
            name: 'Wordsmith',
            icon: 'fas fa-book',
            description: 'Primes whose name spell a proper eight letter English word',
        },
    ];

    /**
     * Get a list of badges
     */
    list() {
        return this.badges;
    }
}