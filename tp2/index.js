import { createServer } from 'node:http'
import { loadFilesSync } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createYoga } from "graphql-yoga";
import { Beers, Users } from "./data.js";

// FIXME charger le schéma avec loadFilesSync
// const typeDefs = ...

// FIXME écrire les resolvers
// const resolvers = ...

// FIXME créer le schéma exécutable avec makeExecutableSchema
// const schema = ...

// FIXME créer le serveur GraphQL avec createYoga
// const yoga = ...

const server = createServer(yoga)

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})
