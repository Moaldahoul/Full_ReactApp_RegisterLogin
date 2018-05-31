import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

const USER_ADDED = 'USER_ADDED';

export default {
    Subscription: {
        userAdded: {
          subscribe: () => pubsub.asyncIterator(USER_ADDED),
        },
      },

    User: {
        boards:({id}, args, { models }) => 
            models.Board.findAll({
                where: {
                    owner: id,
                }
        }) ,
        suggestions:({ id }, args, { models }) => 
            models.Suggestion.findAll({
                where: {
                    creatorId: id,
                } ,
            }),
    },
    Board: {
        suggestions:({ id }, args, { models }) =>
        models.Suggestion.findAll({
            where: {
                boardId: id,
            },
        }),
    },
    Suggestion: {
        creator: ({creatorId}, args, { models }) => 
        models.User.findOne({
                where: {
                    id: creatorId,
                },
            }),
        },
    Query: {
        allUsers: (parent, args, {models}) => models.User.findAll( ),

        me: (parent, args, {models, user}) => {
            if(user){
                    // they are logged in
                return models.User.findOne( { 
                    where: {
                         id: user.id,
                    },
                });
            }   
                //Not logged in
            return null; 
        },
        userBoards: (parent, { owner }, {models}) => 
            models.Board.findAll( { 
                where: {
                    owner,
            },
        }),
        userSuggestions: (parent, { creatorId }, {models}) => 
            models.Suggestion.findAll({ 
                where: {
                    creatorId,
            },
        }),
    },

    Mutation: {
        updateUser: (parent, { username, newUsername } , {models}) => 
                models.User.update({ username: newUsername }, {where: {username}}),
        deleteUser: (parent, args, {models}) => 
                models.User.destroy({ where: args}),
        createBoard: (parent, args, {models}) => models.Board.create(args),
        createSuggestion: (parent, args, {models}) => 
                models.Suggestion.create(args),
        createUser: async (parent, args, { models }) => {
                const user = args;
                user.password = 'idk';
                const userAdded = await models.User.create(user);
                pubsub.publish(USER_ADDED, { 
                    userAdded, 
                });
                    return userAdded;
        },
        register: async (parent, args, { models }) => {
            const user = args;
            user.password = await bcrypt.hash(user.password, 12);
            return models.User.create(user);
        },
        login: async (parent, { email, password }, {models, SECRET}) =>{
            const user = await models.User.findOne({ where: {email} });
            if(!user){
                throw new Error('No User found with this email');
            }
            const valid = await bcrypt.compare(password, user.password);
            if(!valid){
                throw new Error('Incorrect password');
            }
            // token = 'wv1oir13498vu34p5v.123v4120u12v5n409uv3.32159vu15934u'
            // verify: needs secret and it tell us if we have the right token|  we use it for authentication
            //decode: No need a secret "we decode the token" | we use it on the client side {React}
            const token = jwt.sign(
                {
                    user: _.pick(user, ['id', 'username']),
                }
                , SECRET,
                {
                    expiresIn: '1y',
                },);
                return token;
        },   
    },
};