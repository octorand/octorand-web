export class GameSpellSeekerModel {
    id: number = 0;
    account_id: number = 0;
    reveal: string = '';
    allowed: string = '';
    guesses: number = 0;
    started: boolean = false;
    ended: boolean = false;
    boost_1: boolean = false;
    boost_2: boolean = false;
    answers: Array<any> = [];
    inputs: Array<any> = [];
    rewards: number = 0;
    completed: boolean = false;

    /**
     * Letters in alphabet
     */
    private alphabet: Array<string> = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',];

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
        this.guesses = data.guesses;
        this.started = data.started;
        this.ended = data.ended;
        this.boost_1 = data.boost_1;
        this.boost_2 = data.boost_2;

        // Calculate answers property
        let answers = [];
        for (let i = 0; i < this.reveal.length; i++) {
            let answer = this.reveal.charAt(i);
            if (answer == '-') {
                answers.push({ index: i, text: answer, style: 'bg-dark-light text-white' });
            } else {
                answers.push({ index: i, text: answer, style: 'bg-secondary text-dark' });
            }
        }
        this.answers = answers;

        // Calculate inputs property
        let inputs = [];
        for (let i = 0; i < this.alphabet.length; i++) {
            let letter = this.alphabet[i];
            if (this.allowed.split('').includes(letter)) {
                inputs.push({ index: i, letter: letter, allowed: true });
            } else {
                inputs.push({ index: i, letter: letter, allowed: false });
            }
        }
        this.inputs = inputs;

        // Calculate rewards
        this.rewards = 100 - (3 * this.guesses);
        if (this.boost_1) {
            this.rewards = this.rewards - 15;
        }
        if (this.boost_2) {
            this.rewards = this.rewards - 15;
        }
        this.rewards = Math.max(this.rewards, 0);

        // Calculate completed status
        if (this.reveal.split('').includes('-')) {
            this.completed = false;
        } else {
            this.completed = true;
        }
    }
}