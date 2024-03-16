import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SocialHelper {

    socials = [
        {
            id: 'discord',
            name: 'Discord',
            url: 'https://discord.gg/DsHyAcmt8q',
            icon: 'fab fa-discord',
            color: '#7289da'
        },
        {
            id: 'twitter',
            name: 'Twitter',
            url: 'https://twitter.com/octorand',
            icon: 'fab fa-twitter',
            color: '#00acee'
        },
        {
            id: 'reddit',
            name: 'Reddit',
            url: 'https://www.reddit.com/r/Octorand',
            icon: 'fab fa-reddit-alien',
            color: '#ff4500'
        }
    ];

    /**
     * Get a list of socials
     */
    list() {
        return this.socials;
    }
}