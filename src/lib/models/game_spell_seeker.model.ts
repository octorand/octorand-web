export class GameSpellSeekerModel {
    id: number = 0;
    account_id: number = 0;
    reveal: string = '';
    allowed: string = '';
    started: boolean = false;
    ended: boolean = false;
    tries: number = 0;
    answers: Array<any> = [];
    inputs: Array<any> = [];
    rewards: number = 0;

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
        this.started = data.started;
        this.ended = data.ended;
        this.tries = data.tries;

        // Calculate answers property
        let answers = [];
        for (let i = 0; i < this.reveal.length; i++) {
            let answer = this.reveal.charAt(i);
            if (answer == '-') {
                answers.push({ index: i, text: answer, revealed: false });
            } else {
                answers.push({ index: i, text: answer, revealed: true });
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
        this.rewards = 25 - this.tries;
    }
}