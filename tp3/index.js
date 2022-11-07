import { createServer } from "@graphql-yoga/node";
import { readFileSync } from "fs";
import { Beers, Users } from "./data.js";

const typeDefs = readFileSync("./schema.graphql").toString("utf-8");
const resolvers = {
  Query: {
    user(_, { id }) {
      return Users.find((user) => user.id === id);
    },
    users() {
      return Users;
    },
    beer(_, { id }) {
      return Beers.find((beer) => beer.id == id);
    },
    beers() {
      return Beers;
    },
  },
  User: {
    likedBeers(user) {
      return user.likedBeersIds.map(id => Beers.find((beer) => beer.id == id));
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
