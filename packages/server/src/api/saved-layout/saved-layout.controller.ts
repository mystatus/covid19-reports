import { Response } from 'express';
import {
  AddSavedLayoutBody,
  GetSavedLayoutsQuery,
  UpdateSavedLayoutBody,
} from '@covid19-reports/shared';
import {
  ApiRequest,
  OrgParam,
  OrgSavedLayoutParams,
} from '../api.router';
import { SavedLayout } from './saved-layout.model';
import { BadRequestError } from '../../util/error-types';
import { assertRequestBody } from '../../util/api-utils';
import { requireSavedLayout } from '../../util/saved-layout-utils';

class SavedLayoutController {

  async getSavedLayouts(req: ApiRequest<null, null, GetSavedLayoutsQuery>, res: Response) {
    const { entityType } = req.query;

    const savedLayouts = await SavedLayout.getAllowedSavedLayouts(
      req.appOrg!,
      req.appUserRole!.role,
      entityType,
    );

    res.json(savedLayouts);
  }

  async addSavedLayout(req: ApiRequest<OrgParam, AddSavedLayoutBody>, res: Response) {
    const { name, entityType, columns, actions } = assertRequestBody(req, [
      'name',
      'entityType',
      'columns',
      'actions',
    ]);

    const existingSavedLayout = await SavedLayout.findOne({
      relations: ['org'],
      where: {
        name,
        entityType,
        org: req.appOrg!.id,
      },
    });

    if (existingSavedLayout) {
      throw new BadRequestError('There is already a layout with that name.');
    }

    const savedLayout = new SavedLayout();
    savedLayout.org = req.appOrg;
    savedLayout.name = name;
    savedLayout.entityType = entityType;
    savedLayout.columns = columns;
    savedLayout.actions = actions;
    await savedLayout.save();

    res.status(201).json(savedLayout);
  }

  async updateSavedLayout(req: ApiRequest<OrgSavedLayoutParams, UpdateSavedLayoutBody>, res: Response) {
    const { name, entityType, columns, actions } = req.body;

    const savedLayout = await requireSavedLayout(req.params.savedLayoutId);

    if (name) {
      savedLayout.name = name;
    }
    if (entityType) {
      savedLayout.entityType = entityType;
    }
    if (columns) {
      savedLayout.columns = columns;
    }
    if (actions) {
      savedLayout.actions = actions;
    }

    await savedLayout.save();

    res.json(savedLayout);
  }

  async deleteSavedLayout(req: ApiRequest<OrgSavedLayoutParams>, res: Response) {
    const savedLayout = await requireSavedLayout(req.params.savedLayoutId);

    // TODO: Verify layout is unused?
    await savedLayout.remove();

    res.json(savedLayout);
  }

}

export default new SavedLayoutController();
