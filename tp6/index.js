import { createServer } from "@graphql-yoga/node";
import { readFileSync } from "fs";
import fetch from "node-fetch";
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
    async beer(_, { id }) {
      const response = await fetch(`https://api.punkapi.com/v2/beers/${id}`);
      const data = await response.json();
      return data[0];
    },
    async beers() {
      const response = await fetch("https://api.punkapi.com/v2/beers");
      const data = await response.json();
      return data;
    },
    async search(_, { queryString }) {
      const response = await fetch(`https://api.punkapi.com/v2/beers?beer_name=${queryString}`);
      const beers = await response.json();

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
    async likedBeers({ likedBeersIds }) {
      if (!likedBeersIds?.length) return []

      const response = await fetch(`https://api.punkapi.com/v2/beers?ids=${likedBeersIds.join('|')}`)
      const data = await response.json();
      return data;
    },
  },
  Mutation: {
    toggleLike(_, { userId, beerId }) {
      const currentUser = Users.find((user) => user.id === userId);

      if (!currentUser.likedBeersIds) {
        currentUser.likedBeersIds = [beerId];
        return currentUser;
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
});

server.start();
