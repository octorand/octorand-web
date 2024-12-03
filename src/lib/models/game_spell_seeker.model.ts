export class GameSpellSeekerModel {
    id: number = 0;
    account_id: number = 0;
    reveal: string = '';
    allowed: string = '';
    started: boolean = false;
    ended: boolean = false;
    tries: number = 0;

    /**
     * Update properties
     *
     * @param data
     */
    update(data: any) {
        this.id = data.id;
        this.account_id = data.account_id;
        this.reveal = data.reveal;
        this.allowed = data.allowed;
        this.started = data.started;
        this.ended = data.ended;
        this.tries = data.tries;
    }
}