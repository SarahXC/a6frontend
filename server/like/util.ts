import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Like} from './model';
import { Freet } from '../freet/model';

// Update this if you add a property to the Freet type!
type LikeResponse = {
  postedBy: string;
  post: Freet; 
  userLike: string;
  postContent: string; 
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Follow object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Like>} like - A follow
 * @returns {LikeResponse} - The follow object formatted for the frontend
 */
const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse => {
  const likeCopy: Like = {
    ...like.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
return {
    postedBy: likeCopy.userPost.username, 
    userLike: likeCopy.userLike.username, 
    postContent: likeCopy.post.content,
    post: likeCopy.post,
  };
};

export {
  constructLikeResponse
};
