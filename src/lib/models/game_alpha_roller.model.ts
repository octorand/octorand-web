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
        for (let i = 0; i <= this.rounds; i++) {
            let text = '';
            let style = '';

            if (this.reveal.length > i) {
                text = this.reveal.charAt(i);
                if (i > 0) {
                    if (this.results.charAt(i - 1) == '1') {
                        style = 'bg-success text-dark';
                    } else if (this.results.charAt(i - 1) == '0') {
                        style = 'bg-dark-light text-white';
                    }
                } else {
                    style = 'bg-dark-light text-white';
                }
            } else if (this.reveal.length == i) {
                text = '?';
                style = 'bg-secondary text-dark';
            } else {
                text = '-';
                style = 'bg-dark-light text-white';
            }

            cards.push({ index: i, text: text, style: style });
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
        this.max = (this.hits + this.rounds - this.inputs.length) * 10;
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