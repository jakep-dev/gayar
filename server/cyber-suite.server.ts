import * as http from 'http';
//import * as express from 'express';
import * as debug from 'debug';
import { EnvConfig } from './env.config';
import { Security } from './helpers/helpers';
import { App } from './app';
import { Logger } from './helpers/logger.helper';
import { cpus } from 'os';
import * as cluster from 'cluster';

const env: string = process.env.NODE_ENV || 'Dev';
const envConfig: EnvConfig = EnvConfig.getInstance();
envConfig.init(env);

const logger: Logger = Logger.getInstance();

let numCPUs: number;
let app: App;

if (cluster.isMaster) {
    numCPUs = cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    logger.init(env, 0);
    cluster.on('online', function(worker) {
        Logger.info('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        Logger.error('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        Logger.error('Starting a new worker');
        cluster.fork();
    });
} else {
    logger.init(env, cluster.worker.id);
    app = new App();
}
