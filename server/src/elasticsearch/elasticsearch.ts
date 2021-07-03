import { Client } from 'elasticsearch';
import config from '../config';

export const elasticsearch = new Client(config.elasticsearch);
