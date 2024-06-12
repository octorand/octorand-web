import { Injectable } from '@angular/core';
import { WordCulture, WordFiction, WordPart, WordPhrase, WordSmith } from '@lib/words';

@Injectable({ providedIn: 'root' })
export class WordHelper {

    /**
     * words in dictionary
     */
    cultures: Array<string> = [];
    fictions: Array<string> = [];
    parts: Array<string> = [];
    phrases: Array<string> = [];
    smiths: Array<string> = [];

    /**
     * Construct component
     */
    constructor() {
        this.cultures = WordCulture.list;
        this.fictions = WordFiction.list;
        this.parts = WordPart.list;
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
     * Search for a part
     *
     * @param word
     */
    searchPart(word: string): boolean {
        word = word.toLowerCase();
        return this.parts.includes(word);
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