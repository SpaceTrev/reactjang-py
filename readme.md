# 🚀 Space React Django Startup

## Backend

1. ##### Install Python 3

```
🚀  brew install python
```

2. ##### Create project directories + nav to dir + setup virtual env + activate virtual env + install & upgrade pip

```
 🚀  mkdir react-jang
 🚀  cd react-jang
 🚀  python3 -m venv venv
 🚀  source venv/bin/activate
 🚀  pip install --upgrade pip
```

3. ##### Install Django & Create Project then go to http://localhost:8000 in the browser

- ###### (Still in the react-jang directory with virtualenv activated)

```
🚀  pip install Django
🚀  django-admin startproject react_jang ./
🚀  ./manage.py migrate
🚀  ./manage.py runserver
```

- ##### or if docker is running

```
🚀  pip3 install Django
🚀  django-admin startproject react_jang ./
🚀  ./manage.py migrate
🚀  ./manage.py runserver
```

4. ##### Run Postgres in Docker

- ###### (Still in the react-jang directory with virtualenv activated) & Create a new file, react-jang/docker-compose.yml:

```
version: "3.7"
services:
  db:
    image: "postgres:11.5"
    container_name: "reactjang_postgres1"
    ports:
      - "54321:5432"
    volumes:
      - postgres_data1:/var/lib/postgresql/data
volumes:
  postgres_data1:
    name: reactjang_postgres_data1
```

5. ##### Start Docker then start Postgres

```
🚀  docker-compose up -d
🚀  docker-compose logs
```

6. ##### Create a database

- ###### Start psql + Create a db + Create user + Grant + Exit :

```
🚀  docker exec -it reactjang_postgres1 psql -U postgres
```

```
postgres=# create database reactjang;
postgres=# create user reactjanguser with password 'mypassword';
postgres=# grant all privileges on database reactjang to reactjanguser;
postgres=# \q
```

7. ##### Configure Django to use Postgres

- ###### (Still in the react-jang directory with virtualenv activated) & Install psycopg2:

```
🚀  pip3 install psycopg2-binary
```

- ###### Edit react-jang/react_jang/settings.py:

```
DATABASES = {
     "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": "reactjang",
        "USER": "reactjanguser",
        "PASSWORD": "mypassword",
        "HOST": "localhost",
        "PORT": "54321",
    }
}
```

- ##### Run database migrations + run the server & go to http://localhost:8000 in the browser:

```
🚀  ./manage.py migrate
🚀  ./manage.py runserver
```

8. ##### Install and configure Graphene

- ###### (Still in the react-jang directory with virtualenv activated) & Install graphene-django

```
🚀  pip3 install graphene-django
```

- ###### Edit the INSTALLED_APPS setting in react-jang/react_jang/settings.py:

```
INSTALLED_APPS = (
    # After the default packages
    "graphene_django",
)
```

9. ##### Create a new Django app and add a model

- ###### (Still in the travelog-api directory with virtualenv activated) & Create a new Django app:

```
🚀  ./manage.py startapp api
```

- ###### Edit react_jang/settings.py:

```
INSTALLED_APPS = (
    # After the default packages
    'graphene_django',
    'api',
)
```

- ###### Edit react-jang/api/models.py:

```
from django.db.models import DateTimeField, FloatField, Model, TextField

class Location(Model):
    created_at = DateTimeField(auto_now_add=True)
    lat = FloatField()
    lon = FloatField()
    name = TextField(blank=True)
    updated_at = DateTimeField(auto_now=True)
```

- ###### Make and run migrations:

```
🚀  ./manage.py makemigrations
🚀  ./manage.py migrate
```

10. ##### GraphQL Everything

- ###### (Still in the react-jang directory with virtualenv activated) & Create a new file react-jang/api/schema.py

```
import graphene
from graphene_django.types import DjangoObjectType
from .models import Location

class LocationType(DjangoObjectType):
    class Meta:
        model = Location

class Query(object):
    all_locations = graphene.List(LocationType)

    def resolve_all_locations(self, info, **kwargs):
        return Location.objects.all()

class CreateLocation(graphene.Mutation):
    location = graphene.Field(LocationType)

    class Arguments:
        lat = graphene.Float()
        lon = graphene.Float()
        name = graphene.String()

    def mutate(self, info, lat, lon, name):
        loc = Location(lat=lat, lon=lon, name=name)
        loc.save()
        return CreateLocation(location=loc)

class Mutation(graphene.ObjectType):
    create_location = CreateLocation.Field()
```

- ###### Create a new file react-jang/react_jang/schema.py:

```
import graphene
import api.schema


class Query(api.schema.Query, graphene.ObjectType):
    pass


class Mutation(api.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
```

- ###### Edit react-jang/react_jang/urls.py

```
from django.contrib import admin
from django.urls import path
from graphene_django.views import GraphQLView
from .schema import schema

urlpatterns = [
    path("admin/", admin.site.urls),
    path("graphql/", GraphQLView.as_view(graphiql=True, schema=schema)),
]
```

11. ##### Try it using the GraphiQL explorer start server + http://localhost:8000/graphql/:

- ###### (Still in the react-jang directory with virtualenv activated)

```
🚀  ./manage.py runserver
```

## Frontend

1. ##### Create a Apollo client and connect to GraphQL server

- ###### In Parent directory that react-jang is contained by

```
🚀  npx create-react-app client
🚀  cd client
🚀  npm i apollo-boost react-apollo graphql
```

2. ##### Then create a client in app/src/App.js.

```
import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

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
    </div>
  </ApolloProvider>
);

export default App;
```

3. ##### Let’s create a file names User.js in app/src/ and paste the codes below in it. Here we use polling to refetch the result every 0.5 second.

```
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

```

4. ##### Modify backend to accept the cross-site requests of React App

```
🚀  pip3 install django-cors-headers
```

- ###### Modify react-jang/react_jang/settings.py:

```
# Add it to your installed apps
INSTALLED_APPS = [
    ...
    'corsheaders',
    ...
]
...
MIDDLEWARE = [  # Or MIDDLEWARE_CLASSES on Django < 1.10
    ...
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    ...
]
...
# Add CORS_ORIGIN_WHITELIST to allow these domains be authorized to make cross-site HTTP requests
CORS_ORIGIN_WHITELIST = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
    # your React App domain
]
```

5. ##### Add modify react_jang/urls.py

```
from django.views.decorators.csrf import csrf_exempt
urlpatterns = [
    ...
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
]
```

6. ##### Use useMutation to update data

```
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

```

7. ##### Update App.js to import new files

```
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

```

8. ##### Open app to http://localhost:3000/ and add users
