import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import Mustache from "mustache";
import SearchEntities from "./search.graphql";
// import AddABeer from "./toggleLike.graphql";
// import Users from "./users.graphql";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

const context = {
  users: [],
  currentUser: null,
};

const form = document.getElementById("searchForm");
const result = document.getElementById("result");
const listTemplate = document.getElementById("list-template").innerHTML;
const selectTemplate = document.getElementById("select-users").innerHTML;
const select = document.getElementById("select");

const formEventHandler = async () => {
  const formData = new FormData(form);
  const query = formData.get("query") || "";

  const { data } = await client.query({
    query: gql(SearchEntities),
    variables: {
      queryString: query,
    },
  });

  const likedBeersId = context.currentUser.likedBeers.map((el) => el.id);
  const newSearch = data.search.reduce((acc, val) => {
    const value =
      val.__typename === "Beer"
        ? {
            ...val,
            isLiked: likedBeersId.includes(val.id),
            isBeer: true,
          }
        : val;
    acc.push(value);

    return acc;
  }, []);

  result.innerHTML = Mustache.render(listTemplate, {
    search: newSearch,
  });
};

const fetchUsers = async () => {
  const data = []; // FIXME utiliser le client apollo pour lister les users et leur bières

  context.users = [...data.users];
  context.currentUser = data.users[0];
  select.innerHTML = Mustache.render(selectTemplate, data);
  select.value = context.currentUser.id;
};

fetchUsers();

select.addEventListener("change", async (ev) => {
  context.currentUser = context.users.find(
    (user) => user.id === ev.target.value
  );

  const formData = new FormData(form);
  const query = formData.get("query") || "";
  if (query) {
    await formEventHandler();
  }
});

document.addEventListener("click", async (ev) => {
  const likeButton = ev.target.closest(".like-button");

  if (likeButton) {
    const userId = context.currentUser.id;
    const beerId = likeButton.getAttribute("data-id");

    // FIXME utiliser le client apollo pour appeler la mutation toggleLike

    context.currentUser = data.toggleLike;
    const index = context.users.findIndex((el) => el.id === data.toggleLike.id);
    context.users[index] = data.toggleLike;

    await formEventHandler();
  }
});

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();

  await formEventHandler();
});
