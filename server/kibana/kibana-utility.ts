import { Role } from '../api/role/role.model';
import { Workspace } from '../api/workspace/workspace.model';
import { KibanaApi } from './kibana-api';
import elasticsearch from '../elasticsearch/elasticsearch';
import { InternalServerError } from '../util/error-types';

export async function setupKibanaWorkspace(workspace: Workspace, role: Role, kibanaApi: KibanaApi) {
  if (!workspace.workspaceTemplate) {
    throw new Error('createKibanaWorkspace requires a workspace.workspaceTemplate to be set.');
  }

  const savedObjects = [] as KibanaSavedObject[];
  let defaultIndex: string | undefined;
  for (const savedObjectRaw of workspace.workspaceTemplate.kibanaSavedObjects) {
    savedObjects.push({
      id: savedObjectRaw._id,
      type: savedObjectRaw._type,
      attributes: savedObjectRaw._source,
    });
    if (savedObjectRaw._type === 'index-pattern' && savedObjectRaw._source.title === '*') {
      defaultIndex = savedObjectRaw._id;
    }
  }

  await kibanaApi.axios.post('/api/saved_objects/_bulk_create', savedObjects);

  // Set default index
  let esVersion: { version: string }[] = [];
  try {
    esVersion = await elasticsearch.cat.nodes({
      format: 'json',
      h: 'version',
    });
  } catch (err) {
    // We'll handle it with the next check
  }
  if (esVersion.length === 0) {
    throw new InternalServerError('Could not retrieve version from elasticsearch.');
  }
  await kibanaApi.axios.post(`/api/saved_objects/config/${esVersion[0].version}`, {
    attributes: {
      defaultIndex,
    },
  });
}

interface KibanaSavedObject {
  id: string
  type: string
  attributes: any
}
