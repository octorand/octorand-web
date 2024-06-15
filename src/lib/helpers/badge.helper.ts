import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BadgeHelper {

    badges = [
        {
            id: 'artifact',
            name: 'Artifact',
            icon: 'fas fa-book',
        },
        {
            id: 'bountiful',
            name: 'Bountiful',
            icon: 'fas fa-book',
        },
        {
            id: 'chameleon',
            name: 'Chameleon',
            icon: 'fas fa-book',
        },
        {
            id: 'changeling',
            name: 'Changeling',
            icon: 'fas fa-book',
        },
        {
            id: 'culture',
            name: 'Culture',
            icon: 'fas fa-book',
        },
        {
            id: 'drained',
            name: 'Drained',
            icon: 'fas fa-book',
        },
        {
            id: 'equidistant',
            name: 'Equidistant',
            icon: 'fas fa-book',
        },
        {
            id: 'exotic',
            name: 'Exotic',
            icon: 'fas fa-book',
        },
        {
            id: 'explorer',
            name: 'Explorer',
            icon: 'fas fa-book',
        },
        {
            id: 'family',
            name: 'Family',
            icon: 'fas fa-book',
        },
        {
            id: 'fancy',
            name: 'Fancy',
            icon: 'fas fa-book',
        },
        {
            id: 'fiction',
            name: 'Fiction',
            icon: 'fas fa-book',
        },
        {
            id: 'flipper',
            name: 'Flipper',
            icon: 'fas fa-book',
        },
        {
            id: 'founder',
            name: 'Founder',
            icon: 'fas fa-book',
        },
        {
            id: 'phrase',
            name: 'Phrase',
            icon: 'fas fa-book',
        },
        {
            id: 'pioneer',
            name: 'Pioneer',
            icon: 'fas fa-book',
        },
        {
            id: 'pristine',
            name: 'Pristine',
            icon: 'fas fa-book',
        },
        {
            id: 'shapeshifter',
            name: 'Shapeshifter',
            icon: 'fas fa-book',
        },
        {
            id: 'straight',
            name: 'Straight',
            icon: 'fas fa-book',
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