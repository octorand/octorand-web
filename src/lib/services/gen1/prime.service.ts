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
    list(applications: Array<any>) {
        let models = [];
        for (let i = 0; i < applications.length; i++) {
            models.push(this.create(applications[i]));
        }

        return models;
    }
}