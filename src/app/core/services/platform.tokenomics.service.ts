import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlatformTokenomicsService {

    /**
     * Service definition
     */
    private definition: any = null;

    /**
     * Construct service
     */
    constructor() {
        this.definition = {
            id: 'tokenomics',
            name: 'Tokenomics',
            icon: 'fas fa-coins',
            color: '#e67e22',
            route: 'platform/tokenomics',
            description: 'OCTO token, the native currency of Octorand platform comes with interesting deflationary dynamics.'
        };
    }

    /**
     * Get service definition
     */
    getDefinition() {
        return this.definition;
    }
}