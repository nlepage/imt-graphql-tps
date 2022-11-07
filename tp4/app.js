import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import Mustache from "mustache";
// import SearchEntities from "./search.graphql";

// FIXME instancier le client apollo

const form = document.getElementById("searchForm");
const result = document.getElementById("result");
const listTemplate = document.getElementById("list-template").innerHTML;

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();

  const formData = new FormData(form);
  const query = formData.get("query") || "";

  const data = []; // FIXME utiliser le client Apollo pour récupérer les résultats

  result.innerHTML = Mustache.render(listTemplate, data);
});
