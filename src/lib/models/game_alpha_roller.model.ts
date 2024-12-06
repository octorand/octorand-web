export class GameAlphaRollerModel {
    id: number = 0;
    account_id: number = 0;
    reveal: string = '';
    inputs: string = '';
    results: string = '';
    rounds: number = 0;
    hits: number = 0;
    started: boolean = false;
    ended: boolean = false;
    boost_1: boolean = false;
    boost_2: boolean = false;
    cards: Array<any> = [];
    rewards: number = 0;
    max: number = 0;
    completed: boolean = false;

    /**
     * Update properties
     *
     * @param data
     */
    update(data: any) {
        this.id = data.id;
        this.account_id = data.account_id;
        this.reveal = data.reveal;
        this.inputs = data.inputs;
        this.results = data.results;
        this.rounds = data.rounds;
        this.hits = data.hits;
        this.started = data.started;
        this.ended = data.ended;
        this.boost_1 = data.boost_1;
        this.boost_2 = data.boost_2;

        // Calculate cards property
        let cards = [];
        for (let i = 0; i < this.reveal.length; i++) {
            let answer = this.reveal.charAt(i);
            if (answer == '-') {
                cards.push({ index: i, text: answer, revealed: false });
            } else {
                cards.push({ index: i, text: answer, revealed: true });
            }
        }
        this.cards = cards;

        // Calculate rewards
        this.rewards = this.hits * 10;
        if (this.boost_1) {
            this.rewards = this.rewards - 15;
        }
        if (this.boost_2) {
            this.rewards = this.rewards - 25;
        }
        this.rewards = Math.max(this.rewards, 0);

        // Calculate max rewards
        this.max = (this.rounds - this.inputs.length) * 10;
        if (this.boost_1) {
            this.max = this.max - 15;
        }
        if (this.boost_2) {
            this.max = this.max - 25;
        }
        this.max = Math.max(this.max, 0);

        // Calculate completed status
        if (this.inputs.length != this.rounds) {
            this.completed = false;
        } else {
            this.completed = true;
        }
    }
}