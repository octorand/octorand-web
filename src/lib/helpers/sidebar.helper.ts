import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarHelper {

    /**
     * Sidebar configuration
     */
    private sidebar = [
        {
            id: 'collection',
            name: 'Collection',
            items: [
                {
                    id: 'browse',
                    name: 'Browse',
                    icon: 'fas fa-th-large',
                    color: '#f1c40f',
                    route: 'collection/browse',
                },
                {
                    id: 'market',
                    name: 'Market',
                    icon: 'fas fa-shopping-bag',
                    color: '#2980b9',
                    route: 'collection/market',
                },
                {
                    id: 'account',
                    name: 'Account',
                    icon: 'fas fa-user',
                    color: '#e74c3c',
                    route: 'collection/account',
                },
            ]
        },
        {
            id: 'platform',
            name: 'Platform',
            items: [
                {
                    id: 'tokenomics',
                    name: 'Tokenomics',
                    icon: 'fas fa-coins',
                    color: '#9b59b6',
                    route: 'platform/tokenomics',
                },
                {
                    id: 'games',
                    name: 'Games',
                    icon: 'fas fa-chess-knight',
                    color: '#f39c12',
                    route: 'platform/games',
                },
                {
                    id: 'traits',
                    name: 'Traits',
                    icon: 'fas fa-trophy',
                    color: '#2ecc71',
                    route: 'platform/traits',
                },
                {
                    id: 'statistics',
                    name: 'Statistics',
                    icon: 'fas fa-signal',
                    color: '#e74c3c',
                    route: 'platform/statistics',
                },
                {
                    id: 'leaderboard',
                    name: 'Leaderboard',
                    icon: 'fas fa-dumbbell',
                    color: '#1abc9c',
                    route: 'platform/leaderboard',
                },
                {
                    id: 'history',
                    name: 'History',
                    icon: 'fas fa-history',
                    color: '#8e44ad',
                    route: 'platform/history',
                },
                {
                    id: 'upgrade',
                    name: 'Upgrade',
                    icon: 'fas fa-upload',
                    color: '#2980b9',
                    route: 'platform/upgrade',
                },
                {
                    id: 'guide',
                    name: 'Guide',
                    icon: 'fas fa-book-open',
                    color: '#f39c12',
                    route: 'platform/guide',
                },
            ]
        },
        {
            id: 'tools',
            name: 'Tools',
            items: [
                {
                    id: 'launchpad',
                    name: 'Launchpad',
                    icon: 'fas fa-rocket',
                    color: '#f1c40f',
                    route: 'tools/launchpad',
                },
                {
                    id: 'designer',
                    name: 'Designer',
                    icon: 'fas fa-palette',
                    color: '#c0392b',
                    route: 'tools/designer',
                },
            ]
        },
    ];

    /**
     * Get a list of sidebar links
     */
    list() {
        return this.sidebar;
    }
}