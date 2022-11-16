import type {HydratedDocument, Types} from 'mongoose';
import type {User} from './model';
import UserModel from './model';
import CredibilityModel from '../credibility/model';

import CredibilityCollection from '../credibility/collection';
import LikeCollection from '../like/collection';
import FreetCollection from '../freet/collection';
import AdjustfeedCollection from '../adjustfeed/collection';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class UserCollection {
  /**
   * Add a new user
   *
   * @param {string} username - The username of the user
   * @param {string} password - The password of the user
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
  static async addOne(username: string, password: string): Promise<HydratedDocument<User>> {
    const dateJoined = new Date();
    const credibilityScore = 0;

    const user = new UserModel({
      username: username, 
      password: password, 
      dateJoined: dateJoined, 
      credibility: credibilityScore,
  });
    await user.save(); // Saves user to MongoDB
    //synchronization: also add a credibility score
    const credibility = await CredibilityCollection.addOneByUserId(user._id); //TODO: bring back
    const adjustFeed = await AdjustfeedCollection.addOneByUserId(user._id); 
    return user;
  }

  /**
   * Find a user by userId.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({_id: userId});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsername(username: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({username: new RegExp(`^${username.trim()}$`, 'i')});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @param {string} password - The password of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsernameAndPassword(username: string, password: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({
      username: new RegExp(`^${username.trim()}$`, 'i'),
      password
    });
  }

     static async findAll(): Promise<Array<HydratedDocument<User>>> {
      // Retrieves freets and sorts them from most to least recent
      return UserModel.find({}).sort({dateModified: -1});
    }

  /**
   * Update user's information
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} userDetails - An object with the user's updated credentials
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async updateOne(userId: Types.ObjectId | string, userDetails: any): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    if (userDetails.password) {
      user.password = userDetails.password as string;
    }

    if (userDetails.username) {
      user.username = userDetails.username as string;
    }

    await user.save();
    return user;
  }

  /**
   * Delete a user from the collection.
   *
   * @param {string} userId - The userId of user to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    //synchronizations TODO: bring back
    const credibility = await CredibilityCollection.deleteOneByUserId(userId); //TODO: bring back
    const adjustFeed = await AdjustfeedCollection.deleteOneByUserId(userId); 
    const likes = await LikeCollection.deleteMany(userId);
    const freets = await FreetCollection.deleteMany(userId);
    const user = await UserModel.deleteOne({_id: userId});
    return user !== null;
  }
}

export default UserCollection;
