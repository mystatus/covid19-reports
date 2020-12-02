import { SearchResponse } from 'elasticsearch';
import { Response } from 'express';
import { Like } from 'typeorm';
import { json2csvAsync } from 'json-2-csv';
import moment from 'moment';
import {
  ApiRequest,
  OrgParam,
  OrgPrefixParam,
} from '../index';
import { Org } from './org.model';
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from '../../util/error-types';
import elasticsearch, { EsReportSource } from '../../elasticsearch/elasticsearch';

class OrgController {

  async getOrgList(req: ApiRequest<Partial<OrgPrefixParam>>, res: Response) {
    if (!req.appUser.isRegistered) {
      throw new BadRequestError('User is not registered');
    }

    const orgs = await Org.find({
      relations: ['contact'],
      ...(req.params.orgPrefix && {
        where: {
          name: Like(`${req.params.orgPrefix}%`),
        },
      }),
    });

    res.json(orgs);
  }

  async getOrg(req: ApiRequest, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found');
    }

    res.json(req.appOrg);
  }

  async addOrg(req: ApiRequest<null, AddOrgBody>, res: Response) {
    if (!req.body.name) {
      throw new BadRequestError('An organization name must be supplied when adding an organization.');
    }

    if (!req.body.description) {
      throw new BadRequestError('An organization description must be supplied when adding an organization.');
    }

    const org = new Org();
    org.name = req.body.name;
    org.description = req.body.description;
    const newOrg = await org.save();

    await res.status(201).json(newOrg);
  }

  async deleteOrg(req: ApiRequest, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization could not be found.');
    }

    const removedOrg = await req.appOrg.remove();

    res.json(removedOrg);
  }

  async updateOrg(req: ApiRequest<OrgParam, UpdateOrgBody>, res: Response) {
    const name = req.body.name;
    const description = req.body.description;

    if (!req.appOrg) {
      throw new NotFoundError('Organization could not be found.');
    }

    if (name) {
      req.appOrg.name = name;
    }

    if (description) {
      req.appOrg.description = description;
    }

    const updatedOrg = await req.appOrg.save();

    res.json(updatedOrg);
  }

  async export(req: ApiRequest<null, null, ExportQuery>, res: Response) {
    if (!req.appWorkspace) {
      throw new ForbiddenError('You must be assigned to a workspace to export data.');
    }

    const startDate = moment(req.query.startDate ?? 0);
    const endDate = moment(req.query.endDate);

    //
    // Get ES data and stream to client.
    //
    const index = req.appRole!.getKibanaIndex();
    const scrollQueue = [] as SearchResponse<EsReportSource>[];
    try {
      scrollQueue.push(await elasticsearch.search({
        index,
        size: 10000,
        body: {
          query: {
            bool: {
              must: [{
                range: {
                  Timestamp: {
                    gte: startDate.toISOString(),
                    lt: endDate.toISOString(),
                  },
                },
              }],
            },
          },
        },
        scroll: '30s', // Keep the results "scrollable" for 30 seconds (this will be reset on every scroll).
      }));
    } catch (err) {
      throw new InternalServerError(`Elasticsearch: ${err.message}`);
    }

    // Keep scrolling until we've sent all of the hits.
    let hitsSent = 0;
    while (scrollQueue.length) {
      const chunk = scrollQueue.shift()!;

      // Send the total hits before the first chunk so the client can calculate progress.
      const isFirstChunk = (hitsSent === 0);
      if (isFirstChunk) {
        res.header('total-hits', `${chunk.hits.total}`);
      }

      const sourceArray = chunk.hits.hits.map(hit => hit._source);

      const csvChunk = await json2csvAsync(sourceArray, {
        prependHeader: isFirstChunk,
        emptyFieldValue: '',
      });

      res.write(Buffer.from(csvChunk));

      hitsSent += chunk.hits.hits.length;
      if (hitsSent >= chunk.hits.total) {
        break;
      }

      // Get the next response.
      try {
        scrollQueue.push(await elasticsearch.scroll({
          scrollId: chunk._scroll_id!,
          scroll: '30s',
        }));
      } catch (err) {
        throw new Error(`Elasticsearch: ${err.message}`);
      }
    }

    res.end();
  }

}

type AddOrgBody = {
  name: string
  description: string
};

type UpdateOrgBody = AddOrgBody;

type ExportQuery = {
  startDate?: string
  endDate?: string
};

export default new OrgController();
