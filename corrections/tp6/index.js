import { useApolloDataSources } from "@envelop/apollo-datasources";
import { createServer } from "@graphql-yoga/node";
import { readFileSync } from "fs";
import BeerService from "./beerService.js";
import { Users } from "./data.js";

const typeDefs = readFileSync("./schema.graphql").toString("utf-8");
const resolvers = {
  Query: {
    user(_, { id }) {
      return Users.find((user) => user.id === id);
    },
    users() {
      return Users;
    },
    async beer(_, { id }, { dataSources }) {
      return dataSources.beerService.getBeerById(id);
    },
    async beers(_, __, { dataSources }) {
      return dataSources.beerService.getBeers();
    },
    async search(_, { queryString }, { dataSources }) {
      const beers = await dataSources.beerService.getBeersByName(queryString);
      const users = Users.filter((user) => user.name.includes(queryString));

      return [...beers, ...users];
    },
  },
  Entity: {
    __resolveType(root) {
      return root.tagline ? "Beer" : "User";
    },
  },
  User: {
    async likedBeers(root, _, { dataSources }) {
      return root.likedBeersIds ? dataSources.beerService.getBeersById(root.likedBeersIds) : [];
    },
  },
  Mutation: {
    toggleLike(_, { userId, beerId }) {
      const currentUser = Users.find((user) => user.id === userId);

      if (!currentUser.likedBeersIds) {
        currentUser.likedBeersIds = [];
      }

      const indexOfBeer = currentUser.likedBeersIds.indexOf(beerId);

      if (indexOfBeer >= 0) {
        currentUser.likedBeersIds.splice(indexOfBeer, 1);

        return currentUser;
      }

      currentUser.likedBeersIds.push(beerId);
      return currentUser;
    },
  },
};

const server = createServer({
  schema: {
    typeDefs,
    resolvers,
  },
  plugins: [
    useApolloDataSources({
      dataSources() {
        return {
          beerService: new BeerService(),
        }
      },
    })
  ],
});

server.start();
