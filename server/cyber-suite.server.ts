import * as http from 'http';
import * as express from 'express';
import * as debug from 'debug';
import { EnvConfig } from './env.config';
import { Security } from './helpers/helpers';
import { App } from './app';
import { Logger } from './helpers/logger.helper';

const env: string = process.env.NODE_ENV || 'Dev';
const envConfig: EnvConfig = EnvConfig.getInstance();
envConfig.init(env);

const logger: Logger = Logger.getInstance();
logger.init(env);

const app: App = new App(); 


