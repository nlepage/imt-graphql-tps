import { PubSub } from "graphql-subscriptions";
import fetch from "node-fetch";
import { Users } from "./data.js";

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    user: (_, { id }) => Users.find((user) => user.id === id),
    users: () => Users,
    beer: async (_, { id }) => {
      const response = await fetch(`https://api.punkapi.com/v2/beers/${id}`);
      const data = await response.json();
      return data[0];
    },
    beers: async () => {
      const response = await fetch("https://api.punkapi.com/v2/beers");
      const data = await response.json();
      return data;
    },
    search: async (_, { queryString }) => {
      const response = await fetch(
        `https://api.punkapi.com/v2/beers?beer_name=${queryString}`
      );
      const beers = await response.json();

      const users = Users.filter((user) => user.name.includes(queryString));

      return [...beers, ...users];
    },
  },
  Entity: {
    __resolveType: (root) => {
      return root.tagline ? "Beer" : "User";
    },
  },
  User: {
    likedBeers: async (root) => {
      if (root.likedBeersIds) {
        const response = await fetch(
          `https://api.punkapi.com/v2/beers?ids=${root.likedBeersIds.join("|")}`
        );
        const data = await response.json();
        return data;
      }

      return [];
    },
  },
  Mutation: {
    toggleLike: async (_, { userId, beerId }) => {
      const currentUser = Users.find((user) => user.id === userId);

      if (!currentUser.likedBeersIds) {
        currentUser.likedBeersIds = [];
      }

      const indexOfBeer = currentUser.likedBeersIds.indexOf(beerId);
      const response = await fetch(
        `https://api.punkapi.com/v2/beers/${beerId}`
      );
      const data = await response.json();

      if (indexOfBeer >= 0) {
        currentUser.likedBeersIds.splice(indexOfBeer, 1);
        pubsub.publish("BEER_DISLIKED", { beerDisliked: data[0] });

        return currentUser;
      }

      pubsub.publish("BEER_LIKED", { beerLiked: data[0] });
      currentUser.likedBeersIds.push(beerId);

      return currentUser;
    },
  },
  Subscription: {
    beerLiked: {
      subscribe: () => {
        return pubsub.asyncIterator(["BEER_LIKED"]);
      },
    },
    beerDisliked: {
      subscribe: () => {
        return pubsub.asyncIterator(["BEER_DISLIKED"]);
      },
    },
  },
};
