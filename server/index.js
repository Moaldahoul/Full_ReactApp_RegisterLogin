import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import _ from 'lodash';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import joinMonsterAdapt from 'join-monster-graphql-tools-adapter';



import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';
import { createTokens, refreshTokens } from './auth';
import joinMonsterMetadata from './joinMonsterMetadata'


const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
// const myGraphQLSchema = // ... define or import your schema here!

joinMonsterAdapt(schema, joinMonsterMetadata);

// secret file sould be added to .env file
const SECRET = 'asdfghjklqwertyuioppzxcvbnm';

const app = express();

passport.use(new FacebookStrategy(
  {
    clientID: '497361410683373',//process.env.FACEBOOK_CLIENT_ID, // need to be removed before to push it 
    clientSecret: '7cb73f2d52d2d09cb5ef8634e21f89d7', //process.env.FACEBOOK_SECRET_ID, // for real projects you need to add it to the secret place/file to save it and import it
    callbackURL: "http://localhost:4000/auth/facebook/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    //2 Cases
    //#1 first time login
    // #2 other times
    const { id, displayName } = profile;
    //[]
    const fbUsers = await models.FbAuth.findAll({ 
                  limit: 1, 
                  where: { fb_id: id }
                });

    console.log(fbUsers);
    console.log(profile);
    
    if(!fbUsers.length){
      //create user
      const user = await models.User.create();
      await models.FbAuth.create({
        fb_id: id,
        display_name: displayName,
        user_id: user.id
      });
      fbUsers.push(fbUser);
    }
    
    cb(null, fbUsers[0]);
    /* User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    }); */
  },
  ),);

app.use(passport.initialize());

app.get('/flogin', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { session: false }), /* failureRedirect: '/login' */
  async (req, res) => {
    const [token, refreshToken] = await createTokens(req.user, SECRET);
    res.redirect(`http://localhost:4000/home?token=${token}&refreshToken=${refreshToken}`);
    // res.send('Auth Succeed');
    // Successful authentication, redirect home.
    // res.redirect('/');
  },);

const addUser = async (req, res, next) => {
  const token = req.headers['x-token'];
  console.log(token);
  if(token){
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    }catch (err){
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens( token, refreshToken, models, SECRET);
      
      if(newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

app.use(cors('*'));
app.use(addUser);

app.use(
  '/graphiql',
  graphiqlExpress({ 
    endpointURL: '/graphql',
  }),
);


// bodyParser is needed just for POST.
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress( req => ({
    schema, 
    context: { 
      models,
      SECRET,
      user: req.user,
    },
  })),
);


const server = createServer(app);

models.sequelize.sync().then(() => 
  server.listen(4000, () => {
    new SubscriptionServer({
      execute,
      subscribe,
      schema,
    }, 
    {
      server,
      path: '/subscriptions',
    },);
  }),
); 