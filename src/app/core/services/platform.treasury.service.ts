import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlatformTreasuryService {

    /**
     * Service definition
     */
    private definition: any = null;

    /**
     * Construct service
     */
    constructor() {
        this.definition = {
            id: 'treasury',
            name: 'Treasury',
            icon: 'fas fa-piggy-bank',
            color: '#8e44ad',
            route: 'platform/treasury',
            description: 'Treasury is where the platform profits go. We use the profits to buyback and burn OCTO token.'
        };
    }

    /**
     * Get service definition
     */
    getDefinition() {
        return this.definition;
    }
}