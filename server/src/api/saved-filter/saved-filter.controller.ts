import { Response } from 'express';
import {
  ApiRequest, OrgParam, OrgSavedFilterParams,
} from '../api.router';
import { EntityType, FilterConfiguration, SavedFilter } from './saved-filter.model';
import {
  BadRequestError, NotFoundError,
} from '../../util/error-types';

class SavedFilterController {

  async getSavedFilters(req: ApiRequest<OrgParam & { entityType: EntityType }>, res: Response) {
    if (!req.appUserRole) {
      res.json([]);
      return;
    }
    const savedFilters = await SavedFilter.find({
      relations: ['org'],
      where: {
        org: req.appUserRole.role.org!.id,
        entityType: req.params.entityType,
      },
      order: {
        name: 'ASC',
      },
    });
    res.json(savedFilters);
  }

  async addSavedFilter(req: ApiRequest<OrgParam, SavedFilterData>, res: Response) {
    if (!req.body.name) {
      throw new BadRequestError('A name must be supplied when saving a filter.');
    }

    const existingSavedFilter = await SavedFilter.findOne({
      where: {
        name: req.body.name,
        entityType: req.body.entityType,
        org: req.appOrg!.id,
      },
    });

    if (existingSavedFilter) {
      throw new BadRequestError('There is already a filter with that name.');
    }

    const savedFilter = new SavedFilter();
    savedFilter.org = req.appOrg;
    await setSavedFilterFromBody(req.appOrg!.id, savedFilter, req.body);

    const newSavedFilter = await savedFilter.save();
    res.status(201).json(newSavedFilter);
  }

  async updateSavedFilter(req: ApiRequest<OrgSavedFilterParams, SavedFilterData>, res: Response) {
    const existingSavedFilter = await requireSavedFilter(req.params.savedFilterId);
    await setSavedFilterFromBody(req.appOrg!.id, existingSavedFilter, req.body);
    const updatedSavedFilter: SavedFilter = await existingSavedFilter.save();
    res.json(updatedSavedFilter);
  }

  async deleteSavedFilter(req: ApiRequest<OrgSavedFilterParams>, res: Response) {
    const existingSavedFilter = await requireSavedFilter(req.params.savedFilterId);
    // TODO: Verify filter is unused?
    const deletedSavedFilter = await existingSavedFilter.remove();
    res.json(deletedSavedFilter);
  }
}

async function setSavedFilterFromBody(orgId: number, savedFilter: SavedFilter, body: SavedFilterData) {
  if (body.name) {
    savedFilter.name = body.name;
  }
  if (body.entityType) {
    savedFilter.entityType = body.entityType;
  }
  if (body.filterConfiguration !== undefined) {
    if (body.filterConfiguration !== null) {
      savedFilter.filterConfiguration = body.filterConfiguration;
    }
  }
}

async function requireSavedFilter(id: number) {
  const existingSavedFilter = await SavedFilter.findOne({
    relations: ['org'],
    where: { id },
    order: { name: 'ASC' },
  });
  if (!existingSavedFilter) {
    throw new NotFoundError('The filter could not be found.');
  }
  return existingSavedFilter;
}

export interface SavedFilterData {
  name?: string,
  entityType: EntityType,
  filterConfiguration?: FilterConfiguration,
}

export default new SavedFilterController();
