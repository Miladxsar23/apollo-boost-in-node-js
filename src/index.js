import dotenv from "dotenv";
//import fetch polyfill to node js enviroinment
import "cross-fetch/polyfill";
import ApolloClient, { gql } from "apollo-boost";
//config add custom enviroinment variable
dotenv.config();
//config apollo client
const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  request: (operation) => {
    operation.setContext({
      headers: {
        authorization: `bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
      },
    });
  },
});

///////////////////////////Query//////////////////////////////////////////////
/* GET ORGANIZATION -> query*/
const GET_ORGANIZATION = gql`
  query ($organization: String!) {
    organization(login: $organization) {
      name
      url
    }
  }
`;

client
  .query({
    query: GET_ORGANIZATION,
    variables: {
      organization: "facebook",
    },
  })
  .then(console.log);

/* GET REPOSITORIES OF ORGANIZATION -> query*/
const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  query ($organization: String!, $last: Int!) {
    organization(login: $organization) {
      name
      url
      repositories(last: $last) {
        edges {
          node {
            name
            url
          }
        }
      }
    }
  }
`;
client
  .query({
    query: GET_REPOSITORIES_OF_ORGANIZATION,
    variables: {
      organization: "facebook",
      last: 5,
    },
  })
  .then(console.log);

/* GET_REPOSITORY_ORDERED -> query */
const GET_REPOSITORY_ORDERED = gql`
  query (
    $organization: String!
    $first: Int!
    $cursor: String
    $field: RepositoryOrderField!
    $direction: OrderDirection!
  ) {
    organization(login: $organization) {
      name
      url
      repositories(
        first: $first
        after: $cursor
        orderBy: { field: $field, direction: $direction }
      ) {
        edges {
          ...repositoryNode
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }

  fragment repositoryNode on RepositoryEdge {
    node {
      name
      url
    }
  }
`;

client
  .query({
    query: GET_REPOSITORY_ORDERED,
    variables: {
      organization: "facebook",
      first: 5,
      field: "STARGAZERS",
      direction: "DESC",
      cursor: "Y3Vyc29yOnYyOpLNg-vOBag6qQ==",
    },
  })
  .then(console.log);
///////////////////////////////////////Mutation////////////////////////////////////////////
/* addStart */
const ADD_STAR_TO_REPOSITORY = gql`
  mutation ($starrableId: ID!) {
    addStar(input: { starrableId: $starrableId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;
client
  .mutate({
    mutation: ADD_STAR_TO_REPOSITORY,
    variables: { starrableId: "MDEwOlJlcG9zaXRvcnk2OTM0Mzk1" },
  })
  .then(console.log);

/* removeStar */
const REMOVE_START_OF_REPOSITORY = gql`
  mutation ($repositoryId: ID!) {
    removeStar(input: { starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;
client.mutate({
  mutation: REMOVE_START_OF_REPOSITORY,
  variables: {
    repositoryId: "MDEwOlJlcG9zaXRvcnk2OTM0Mzk1",
  },
}).then(console.log)
