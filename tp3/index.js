import { createServer } from 'node:http'
import { loadFilesSync } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createYoga } from "graphql-yoga";
import { Beers, Users } from "./data.js";

const typeDefs = loadFilesSync("./schema.graphql");
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

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const yoga = createYoga({ schema })

const server = createServer(yoga)

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})
