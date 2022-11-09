import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';

import * as util from './util';
import UserCollection from '../user/collection';
import AdjustfeedCollection from './collection';
import { Adjustfeed } from './model';

const router = express.Router();

/**
 * Get the feed breakdown by username
 *
 * @name GET /api/adjustfeed?userid=id
 *
 * @return {[AdjustfeedResponse]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
router.get(
  '/breakdown',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const user = await UserCollection.findOneByUserId(userId);
    const adjustfeed = await AdjustfeedCollection.findOneByUserId(user._id);
    const response = util.constructAdjustfeedResponse(adjustfeed); 
    res.status(200).json(response); 
  }
);

/**
 * Modify your feed
 *
 * @name PUT /api/adjustfeeds/
 *
*/
 router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    //TODO: has adjustfeed default
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const politics = (req.body.politics.toLowerCase() as string == 'rue') ? true : false;
    const entertainment = (req.body.entertainment.toLowerCase() as string == 'true') ? true : false;
    const sports = (req.body.sports.toLowerCase() as string == 'true') ? true : false;
    const news = (req.body.news.toLowerCase() as string == 'true') ? true : false;
    const adjustfeed = await AdjustfeedCollection.updateOneByUserId(userId, politics, entertainment, sports, news);
    res.status(200).json({
      message: 'Your feed was updated successfully.',
      adjustFeed: util.constructAdjustfeedResponse(adjustfeed)
    });
  }
);

export {router as adjustfeedRouter};