import type {HydratedDocument, Types} from 'mongoose';
import type {Credibility} from './model';
import CredibilityModel from './model';
import UserCollection from '../user/collection';
import e from 'express';
import FollowCollection from '../follow/collection';
import LikeCollection from '../like/collection';

/**
 * addOneByUserId
 * updateOneByUserId
 * findOneByUserId
 * deleteOneByUserId
 */

class CredibilityCollection {

  /**
   * Add a Credibility to the collection
   *
   * @param {string} userId - The id of user
   * @param {number} score - their credibility score
   * @param {boolean} canPost - whether they have enough fritters to post 
   * @return {Promise<HydratedDocument<Credibility>>} - The newly created credibility 
   */
  static async addOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<Credibility>> {
    const user = await UserCollection.findOneByUserId(userId);
    const credibility = new CredibilityModel({
      user: user,
      score: 0,
      canPost: false, 
    });
    await credibility.save(); 
    return credibility.populate('user'); 
  }


  /**
   * Update a Credibility by userId
   *
   * @param {string} userId - The id of the user to find
   * @return {Promise<HydratedDocument<Credibility>> | Promise<null> } - The Credibility with the given userId, if any
   */
  static async updateOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<Credibility>> {
    const user = await UserCollection.findOneByUserId(userId);
    const credibility = await CredibilityModel.findOne({user: user});
    const numLikes = (await LikeCollection.findAllLikesRecieved(userId)).length;
    const numFollowers = (await FollowCollection.findAllFollowersByID(userId)).length;

    credibility.score =  numLikes + 2* numFollowers;
    credibility.canPost = credibility.score >4 ? true : false;
    await credibility.save();

    user.credibility = credibility.score;
    await user.save();
    return credibility.populate('user'); //populate for things with Schema.Type and objects 
  }

  /**
   * Get a user's Credibility by userId
   *
   * @param {string} userId - The id of the user to find
   * @return {Promise<HydratedDocument<Credibility>> | Promise<null> }
   */
   static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<Credibility>> {
    const credibility = await CredibilityCollection.updateOneByUserId(userId); //update first
    return credibility.populate('user');
  }

  /**
   * Delete a user's Credibility by userId
   *
   * @param {string} userId - The id of the user to find
   * @return {Promise<HydratedDocument<Credibility>> | Promise<null> }
   */
   static async deleteOneByUserId(userId: Types.ObjectId | string): Promise<boolean>  {
    const user = await UserCollection.findOneByUserId(userId);
    const credibility = await CredibilityModel.deleteOne({user: user});
    return credibility != null; 
  }

}

export default CredibilityCollection;
