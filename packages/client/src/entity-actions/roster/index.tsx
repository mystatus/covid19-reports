import { getRegistry } from '../actions';
import { downloadCSVTemplate } from './downloadCSVTemplate';
import { exportCSV } from './exportCSV';

const registry = getRegistry('roster');
registry.register(downloadCSVTemplate);
registry.register(exportCSV);


