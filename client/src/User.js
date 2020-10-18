import React from "react";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";
const QUERY_USERS = gql`
  query {
    allUsers {
      id
      name
      email
      password
    }
  }
`;
export function UserInfo() {
  // Polling: provides near-real-time synchronization with
  // your server by causing a query to execute periodically
  // at a specified interval
  const { data, loading } = useQuery(QUERY_USERS, {
    pollInterval: 500, // refetch the result every 0.5 second
  });

  // should handle loading status
  if (loading) return <p>Loading...</p>;

  return data.allUsers.map(({ id, name, email, password }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
      key={id}
    >
      <p style={{ margin: "10px 10px" }}>
        User - {id}: {name}
      </p>
      <p style={{ margin: "10px 10px" }}>Email - {email}</p>
      <p style={{ margin: "10px 10px" }}>password - {password}</p>
    </div>
  ));
}
