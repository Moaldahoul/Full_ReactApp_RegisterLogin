import React from 'react';
import ReactDOM from 'react-dom';
import { createNetworkInterface, ApolloProvider } from 'react-apollo'; //1
import ApolloClient from 'apollo-client'; //2 it could be replaced with the next line 
// import { ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws';
import 'flexboxgrid/dist/flexboxgrid.min.css';

import Routes from './routes';

injectTapEventPlugin();

// const networkInterface = createNetworkInterface({
//     uri: '/graphql',
//     opts: {
//       credentials: 'same-origin',
//     },
//   });

const networkInterface = createNetworkInterface({
    uri: 'http://localhost:4000/graphql',
    // uri: 'http://localhost:4000',
  });

const wsClient = new SubscriptionClient(`ws://localhost:4000/subscriptions`, {
    reconnect: true
  });

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient
  );

networkInterface.use([
    {
        applyMiddleware(req, next){
            if(!req.options.headers){
                req.options.headers={};
            }
            req.options.headers['x-token'] = localStorage.getItem('token');
            req.options.headers['x-refresh-token'] = localStorage.getItem('refreshToken');
            next();
        },
    },
]);

const client = new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions,
  });

const App = (
    <MuiThemeProvider>
        <ApolloProvider client={client}>
            <Routes />
        </ApolloProvider>
    </MuiThemeProvider> 
);

ReactDOM.render(App, document.getElementById('root'));
