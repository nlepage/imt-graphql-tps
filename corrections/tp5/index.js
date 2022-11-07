import { readFileSync } from "fs";
import { resolvers } from "./resolvers.js";
import { startServer } from "./server.js";

const typeDefs = readFileSync("./schema.graphql").toString("utf-8");

startServer(typeDefs, resolvers);
