import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from '../follow/collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the follows
 *
 * @name GET /api/freets
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get freets by author.
 *
 * @name GET /api/freets?authorId=id
 *
 * @return {FreetResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
 router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {

    const allFollows = await FollowCollection.findAll();
    const response = allFollows.map(util.constructFollowResponse);
    res.status(200).json(response);
  }
);

/**
 * Get everyone following the user
 *
 * @name GET /api/follows
 *
 * @return {FollowResponse[]} - A list of all the follow  sorted in descending
 *                      order by date created
 */

router.get(
  '/followings',
  [
    userValidator.isUserLoggedIn
  ], 
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const allFollows = await FollowCollection.findAllFollowingsByID(userId);
    const response = allFollows.map(util.constructFollowResponse);
    res.status(200).json({
      message: 'You are following:',
      followings: response
    });
  },
);

router.get(
  '/followers',
  [
    userValidator.isUserLoggedIn
  ], 
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const allFollows = await FollowCollection.findAllFollowersByID(userId);
    const response = allFollows.map(util.constructFollowResponse);
    res.status(200).json({
      message: 'You are followed by:',
      followers: response
    });
  },
);

/**
 * Create a new follow.
 *
 * @name POST /api/follow
 *
 * @param {string} followed - who the current user wants to follow
 * @return {FollowResponse} - The created follow
 * @throws {403} - If the user is not logged in //TODO 
 * @throws {400} - If the follow already exists
 * @throws {404} - If the followed user does not exist
 */
router.post(
  '/', // the username of the user to follow
  [
    userValidator.isUserLoggedIn,
    followValidator.isFollowSelf,
    followValidator.isFollowedUserExists,
    followValidator.isFollowNotExists,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const followed = await UserCollection.findOneByUsername(req.body.username); //get the Id of the username
    const follow = await FollowCollection.followOne(userId, followed._id); //TODO: _id or id
    res.status(201).json({
      message: 'You successfully followed the user.',
      follow: util.constructFollowResponse(follow)
    });
  }
);

/**
 * Delete a follow
*
 * @name DELETE /api/follows/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the follow doesn't already exist
 */

router.delete(
  '/', // the username of the user to unfollow 
  [
    userValidator.isUserLoggedIn,
    followValidator.isFollowedUserExists,
    followValidator.isFollowExists, 
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const followed = await UserCollection.findOneByUsername(req.body.username);//get the Id of the username
    const unfollow = await FollowCollection.unfollowOne(userId, followed._id); //TODO: _id or id
    res.status(201).json({
      message: 'You successfully unfollowed the user.'
    });
  }
);

export {router as followRouter};
