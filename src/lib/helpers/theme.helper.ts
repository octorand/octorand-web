import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeHelper {

    /**
     * List of themes
     */
    private themes = [
        {
            id: 0,
            name: 'Red',
        },
        {
            id: 1,
            name: 'Yellow',
        },
        {
            id: 2,
            name: 'Blue',
        },
        {
            id: 3,
            name: 'Cyan',
        },
        {
            id: 4,
            name: 'Teal',
        },
        {
            id: 5,
            name: 'Emerald',
        },
        {
            id: 6,
            name: 'Green',
        },
        {
            id: 7,
            name: 'Rose',
        },
        {
            id: 8,
            name: 'Pink',
        },
        {
            id: 9,
            name: 'Purple',
        },
        {
            id: 10,
            name: 'Violet',
        },
        {
            id: 11,
            name: 'Gray',
        },
        {
            id: 12,
            name: 'Orange',
        },
        {
            id: 13,
            name: 'Indigo',
        },
        {
            id: 14,
            name: 'Lime',
        },
        {
            id: 15,
            name: 'Amber',
        },
    ];

    /**
     * Get a list of themes
     */
    list() {
        return this.themes;
    }

    /**
     * Find skin
     *
     * @param index
     */
    find(index: number): any {
        return this.themes.find(t => t.id == index) ? this.themes.find(t => t.id == index) : this.themes[0];
    }
}