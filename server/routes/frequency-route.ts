import {  Request, Response, NextFunction, Application } from 'express';
import { BaseRoute } from './base-route';
import { Logger } from '../helpers/helpers';

export class FrequencyRouter extends BaseRoute {
    
    constructor(private app: Application){
        super();
        this.init();
    }
    
    init(){
    }
}