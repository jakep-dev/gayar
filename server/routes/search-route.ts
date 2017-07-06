import {  Request, Response, NextFunction, Application } from 'express';
import { BaseRoute } from './base-route';

export default class SearchRouter extends BaseRoute {
    
    constructor(private app: Application){
        super();
        this.init();
    }

    init(){
       
    }
}

