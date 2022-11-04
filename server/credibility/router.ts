import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as credibilityValidator from './middleware';

import * as util from './util';
import CredibilityCollection from './collection';
import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Get the Credibility Score of the current user
 *
 * @name GET /api/credibility
 *
 * @return {[CredibilityResponse]} - 
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
    // credibilityValidator.isValidUsername,
    credibilityValidator.hasCredibilityScore,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserCollection.findOneByUserId(req.session.userId); 
    const credibility = await CredibilityCollection.findOneByUserId(user._id);
    const response = util.constructCredibilityResponse(credibility); //don't need map because only returning one thing
    res.status(200).json(response); //TODO 
  }
);

export {router as credibilityRouter};