import { Injectable } from '@angular/core';
import { WordCulture, WordFiction, WordPhrase, WordSmith } from '@lib/words';

@Injectable({ providedIn: 'root' })
export class WordHelper {

    /**
     * List of cultures
     */
    cultures: Array<string> = [];

    /**
     * List of fictions
     */
    fictions: Array<string> = [];

    /**
     * List of phrases
     */
    phrases: Array<string> = [];

    /**
     * List of dictionary words
     */
    smiths: Array<string> = [];

    /**
     * Construct component
     */
    constructor() {
        this.cultures = WordCulture.list;
        this.fictions = WordFiction.list;
        this.phrases = WordPhrase.list;
        this.smiths = WordSmith.list;
    }

    /**
     * Search for a culture
     *
     * @param word
     */
    searchCulture(word: string): boolean {
        word = word.toLowerCase();
        return this.cultures.includes(word);
    }

    /**
     * Search for a fiction
     *
     * @param word
     */
    searchFiction(word: string): boolean {
        word = word.toLowerCase();
        return this.fictions.includes(word);
    }

    /**
     * Search for a phrase
     *
     * @param word
     */
    searchPhrase(word: string): boolean {
        word = word.toLowerCase();
        return this.phrases.includes(word);
    }

    /**
     * Search for a smith
     *
     * @param word
     */
    searchSmith(word: string): boolean {
        word = word.toLowerCase();
        return this.smiths.includes(word);
    }
}