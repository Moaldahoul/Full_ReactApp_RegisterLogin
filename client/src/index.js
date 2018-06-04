import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo'
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Routes from './routes';

injectTapEventPlugin();

const networkInterface = createNetworkInterface({
    uri: 'http://localhost:4000/graphql',
  });
  const client = new ApolloClient({
    networkInterface,
  });

const App = (
    <MuiThemeProvider>
        <ApolloProvider client={client}>
            <Routes />
        </ApolloProvider>
    </MuiThemeProvider> 
    );

ReactDOM.render(App, document.getElementById('root'));


