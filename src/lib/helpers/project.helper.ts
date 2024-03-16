import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProjectHelper {

    projects = [
        {
            id: 'core',
            name: 'OCTOCORE',
            route: '',
        },
        {
            id: 'play',
            name: 'OCTOPLAY',
            route: 'play',
        }
    ];

    /**
     * Find project by id
     *
     * @param id
     */
    find(id: string) {
        return this.list().find(g => g.id == id);
    }

    /**
     * Get a list of projects
     */
    list() {
        return this.projects;
    }
}