import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as tagValidator from './middleware';

import * as util from './util';
import CredibilityCollection from './collection';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import TagCollection from './collection';

const router = express.Router();

/**
 * Get the post's tag by freetId
 *
 * @name GET /api/tags?postid=id
 *
 * @return {[TagResponse]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const tag = await TagCollection.findOne(req.query.freetId as string);
    const response = util.constructTagResponse(tag); 
    res.status(200).json(response); //TODO 
  }
);

/**
 * Modify your tag
 *
 * @name PUT /api/tags/
 *
*/
router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    tagValidator.isValidTag, 
  ],
  async (req: Request, res: Response) => {
    const tag = await TagCollection.updateOne(req.body.freetId, req.body.category);
    res.status(200).json({
      message: 'Your tag was updated successfully.',
      tag: util.constructTagResponse(tag)
    });
  }
);

export {router as tagRouter};