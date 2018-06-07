import { gql } from 'react-apollo';

export const register = gql`
    mutation($username: String!, $email: String!, $password: String!){
        register(username: $username, email: $email, password: $password){
            id
            username
            email
        }
    }
`;