import qs from 'qs';
import { Workspace } from '../api/workspace/workspace.model';
import { KibanaApi } from './kibana-api';
import { elasticsearch } from '../elasticsearch/elasticsearch';
import { InternalServerError } from '../util/error-types';
import { WorkspaceTemplate } from '../api/workspace/workspace-template.model';

export async function setupKibanaWorkspace(workspace: Workspace, kibanaApi: KibanaApi) {
  if (!workspace.workspaceTemplate) {
    throw new Error('createKibanaWorkspace requires a workspace.workspaceTemplate to be set.');
  }

  const savedObjects = [] as KibanaSavedObject[];
  let defaultIndex: string | undefined;
  const templateSavedObjects = (await WorkspaceTemplate.findOne({
    select: ['kibanaSavedObjects'],
    where: {
      id: workspace.workspaceTemplate.id,
    },
  }))?.kibanaSavedObjects;
  for (const savedObjectRaw of templateSavedObjects) {
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

export async function getKibanaWorkspaceDashboards(kibanaApi: KibanaApi) {
  const response = await kibanaApi.axios.get('/api/saved_objects/_find', {
    params: {
      type: 'dashboard',
      fields: ['id', 'title', 'description'],
      per_page: 1000,
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
  });

  const data = response.data as {
    saved_objects: Array<{
      id: string
      attributes: {
        title: string
        description: string
      }
    }>
  };

  return data.saved_objects.map(so => ({
    uuid: so.id,
    title: so.attributes.title,
    description: so.attributes.description,
  }));
}

interface KibanaSavedObject {
  id: string
  type: string
  attributes: any
}
