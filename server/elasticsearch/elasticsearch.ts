import { Client } from 'elasticsearch';
import config from '../config';

export default new Client(config.elasticsearch);
