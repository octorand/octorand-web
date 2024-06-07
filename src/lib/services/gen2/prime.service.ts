import { Injectable } from '@angular/core';
import { GenTwoPrimeModel } from '@lib/models';

@Injectable({ providedIn: 'root' })
export class GenTwoPrimeService {

    /**
     * Create prime model from application state
     *
     * @param application
     */
    create(application: any): GenTwoPrimeModel {
        let model = new GenTwoPrimeModel();
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