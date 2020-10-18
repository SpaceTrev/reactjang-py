import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { UserInfo } from "./User";
import { CreateUser } from "./CreateUser";

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql/", // your GraphQL Server
});

const App = () => (
  <ApolloProvider client={client}>
    <div
      style={{
        backgroundColor: "#00000008",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h2>Trev&apos;s React Apollo Django App 🚀</h2>
      <CreateUser />
      <UserInfo />
    </div>
  </ApolloProvider>
);

export default App;
