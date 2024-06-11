import { Injectable } from '@angular/core';
import { GenOnePrimeModel } from '@lib/models';

@Injectable({ providedIn: 'root' })
export class GenOnePrimeService {

    /**
     * Create prime model from application state
     *
     * @param application
     */
    create(application: any): GenOnePrimeModel {
        let model = new GenOnePrimeModel();
        model.load(application);

        return model;
    }

    /**
     * Create prime models from application states
     *
     * @param applications
     */
    list(applications: Array<any>): Array<GenOnePrimeModel> {
        let models = [];
        for (let i = 0; i < applications.length; i++) {
            models.push(this.create(applications[i]));
        }

        models = this.calculateRank(models);

        return models;
    }

    /**
     * Calculate rank
     *
     * @param models
     */
    private calculateRank(models: Array<GenOnePrimeModel>): Array<GenOnePrimeModel> {
        var rank = 1;
        models.sort((first, second) => second.score - first.score);
        for (let i = 0; i < models.length; i++) {
            if (i > 0 && models[i].score < models[i - 1].score) {
                rank++;
            }
            models[i].rank = rank;
        }
        models.sort((first, second) => first.id - second.id);

        return models;
    }
}