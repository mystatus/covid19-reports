import { getRegistry } from './actions';
import { addRosterEntry } from './roster/addRosterEntry';
import { downloadCSVTemplate } from './roster/downloadCSVTemplate';
import { editRosterEntry } from './roster/editRosterEntry';
import { exportCSV } from './roster/exportCSV';
import { uploadCSV } from './roster/uploadCSV';

const rosterActions = getRegistry('roster');
rosterActions.register(addRosterEntry);
rosterActions.register(downloadCSVTemplate);
rosterActions.register(editRosterEntry);
rosterActions.register(exportCSV);
rosterActions.register(uploadCSV);

