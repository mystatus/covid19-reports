import { getRegistry } from './actions';
import { downloadCSVTemplate } from './roster/downloadCSVTemplate';
import { exportCSV } from './roster/exportCSV';

const rosterActions = getRegistry('roster');
rosterActions.register(downloadCSVTemplate);
rosterActions.register(exportCSV);

