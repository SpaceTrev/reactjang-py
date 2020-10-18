import React from "react";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo";

const CREATE_USER = gql`
  mutation createUser($email: String!, $name: String!, $password: String!) {
    createUser(email: $email, name: $name, password: $password) {
      user {
        name
      }
    }
  }
`;
export function CreateUser() {
  let inputName, inputEmail, inputPassword;
  const [createUser, { data }] = useMutation(CREATE_USER);
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createUser({
            variables: {
              email: inputEmail.value,
              name: inputName.value,
              password: inputPassword.value,
            },
          });
          inputName.value = "";
          inputEmail.value = "";
          inputPassword.value = "";
        }}
        style={{ marginTop: "2em", marginBottom: "2em" }}
      >
        <label>Name: </label>
        <input
          ref={(node) => {
            inputName = node;
          }}
          style={{ marginRight: "1em" }}
        />
        <label>Email: </label>
        <input
          ref={(node) => {
            inputEmail = node;
          }}
          style={{ marginRight: "1em" }}
        />

        <label>Password: </label>
        <input
          ref={(node) => {
            inputPassword = node;
          }}
          style={{ marginRight: "1em" }}
        />

        <button type="submit" style={{ cursor: "pointer" }}>
          Add a User
        </button>
      </form>
    </div>
  );
}
