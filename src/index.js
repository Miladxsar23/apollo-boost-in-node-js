import dotenv from "dotenv";
//import fetch polyfill to node js enviroinment
import "cross-fetch/polyfill";
import { ApolloClient } from "apollo-boost";
//config add custom enviroinment variable
dotenv.config();
//config apollo client
const client = new ApolloClient({
  url: "https://api.github.com/graphql",
  request: (operation) => {
    operation.setContext({
      headers: {
        authorization: `bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
      },
    });
  },
});
