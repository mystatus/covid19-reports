import { Response } from 'express';
import {
  AddSavedFilterBody,
  GetSavedFiltersQuery,
  UpdateSavedFilterBody,
} from '@covid19-reports/shared';
import {
  ApiRequest,
  OrgParam,
  OrgSavedFilterParams,
} from '../api.router';
import { SavedFilter } from './saved-filter.model';
import { BadRequestError } from '../../util/error-types';
import { assertRequestBody } from '../../util/api-utils';
import { requireSavedFilter } from '../../util/saved-filter-utils';

class SavedFilterController {

  async getSavedFilters(req: ApiRequest<null, null, GetSavedFiltersQuery>, res: Response) {
    const { entityType } = req.query;

    const savedFilters = await SavedFilter.getAllowedSavedFilters(
      req.appOrg!,
      req.appUserRole!.role,
      entityType,
    );

    res.json(savedFilters);
  }

  async addSavedFilter(req: ApiRequest<OrgParam, AddSavedFilterBody>, res: Response) {
    const { name, entityType, config } = assertRequestBody(req, [
      'name',
      'entityType',
    ]);

    const existingSavedFilter = await SavedFilter.findOne({
      relations: ['org'],
      where: {
        name,
        entityType,
        org: req.appOrg!.id,
      },
    });

    if (existingSavedFilter) {
      throw new BadRequestError('There is already a filter with that name.');
    }

    const savedFilter = new SavedFilter();
    savedFilter.org = req.appOrg;
    savedFilter.name = name;
    savedFilter.entityType = entityType;
    savedFilter.config = config ?? {};
    await savedFilter.save();

    res.status(201).json(savedFilter);
  }

  async updateSavedFilter(req: ApiRequest<OrgSavedFilterParams, UpdateSavedFilterBody>, res: Response) {
    const { name, entityType, config } = req.body;

    const savedFilter = await requireSavedFilter(req.params.savedFilterId);

    if (name) {
      savedFilter.name = name;
    }
    if (entityType) {
      savedFilter.entityType = entityType;
    }
    if (config != null) {
      savedFilter.config = config;
    }

    await savedFilter.save();

    res.json(savedFilter);
  }

  async deleteSavedFilter(req: ApiRequest<OrgSavedFilterParams>, res: Response) {
    const savedFilter = await requireSavedFilter(req.params.savedFilterId);

    // TODO: Verify filter is unused?
    await savedFilter.remove();

    res.json(savedFilter);
  }

}

export default new SavedFilterController();
