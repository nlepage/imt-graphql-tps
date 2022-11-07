import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import Mustache from "mustache";
import SearchEntities from "./search.graphql";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const form = document.getElementById("searchForm");
const result = document.getElementById("result");
const listTemplate = document.getElementById("list-template").innerHTML;

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();

  const formData = new FormData(form);
  const query = formData.get("query") || "";

  const { data } = await client.query({
    query: gql(SearchEntities),
    variables: {
      queryString: query,
    },
  });

  result.innerHTML = Mustache.render(listTemplate, data);
});
