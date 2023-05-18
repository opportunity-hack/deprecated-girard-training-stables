# Team info

## Contributors 
### Founding Members
#### From Opportunity Hack 2020 
[Demo Video](https://youtu.be/uDrTW5eCXrk)
- Akash
- Thapasya
- Balaji
#### ASU Capstone 2021-2022
See [this GDoc](https://docs.google.com/document/d/1shUfn48GiY9GI5TwUXjtRiCZkh1ByhFMDqHASAHv4fU/edit#bookmark=id.wqt8p3hn8e8p) for working functionality as of 21NOV2022
- Michael: Front-end
- Justin: Front-end
- Aaron: Backend
- Peter: Backend
- Shreyas: Backend + Mongo

## Useful links
- [Problem statement](https://ohack.dev/project/61c75dac1aaf11edbca3acde48001122)
- [#npo-girard-training-stables Slack channel](https://opportunity-hack.slack.com/archives/C01CMCF4BUN)
## Setup instructions
We use Atlas (MongoDB service) free-tier (M0) to host our database.  Create an
account and a database over at <https://cloud.mongodb.com/>. You will need a URI
that you can use to connect to that database. Don't forget to whitelist the IP
address that you will be connecting from.

We use Auth0 for authentication and role-based access control (RBAC). make an
account and a new tenant at <http://auth0.com>. The application assumes the
existence of an `admin` role that you will need to [create on your
tenant](https://auth0.com/docs/manage-users/access-control/configure-core-rbac/roles/create-roles)
and assign some users to.

For RBAC in the application to function properly, you need to add [Auth0
actions](https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow#add-user-roles-to-id-and-access-tokens)
to the tenant's [login
flow](https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow).
Currently, there is one action the application needs which can be found in this
repository at `./auth0/actions/getRoles.js`. In the Auth0 dashboard for your
tenant, [create a custom
action](https://auth0.com/docs/customize/actions/write-your-first-action#create-an-action),
and copy the contents of this file into the Actions Code Editor. Deploy the
action, and then go to "Actions > Flows > Login" and set that action to run
after the user logs in so that role information will be attached to their
identity token.

Make an Auth0 application for the frontend client. You will need the tenant
domain, and the client ID and client secret from that application for the
following steps. You will also need to make an Auth0 API with the identifier
`https://girard-server.herokuapp.com`. This will be used as the audience
authorization parameter when requesting access tokens for the API. The following
permissions need to be added to the API and given to the admin role:

- `create:events`
- `read:events`
- `update:events`
- `delete:events`

Make sure to enable RBAC in the settings for the API, and to toggle 'Add
Permissions in the Access Token' on.

## 1. Create a .env file
In ./server, create a .env file that will allow NodeJS to read environment variables, add these variables.
```
ATLAS_URI=mongodb+srv://<username>:<password>@<URI>/?retryWrites=true&w=majority
PORT=2222
EMAIL=test@something.com
PASSWORD=daklsdjad
MAIN_URL=www.ohack.org
AUTH0_AUDIENCE=https://girard-server.herokuapp.com
AUTH0_DOMAIN=<YOUR AUTH0 TENANT DOMAIN>
AUTH0_CLIENT_SECRET=<The client ID of your Auth0 backend application>
```

## 2. Server side

Server running at
```
https://jelly-apple-efraasia.glitch.me/
```

To Start the app
```
cd server/
npm i && npm start
```
1. To create/ book a lesson
  ```
  POST https://jelly-apple-efraasia.glitch.me/lessons

  {
    "instructor": "5fbad74fd9127ba2ebe12b6e",
    "volunteers": {
        "barn crew": {
            "required": 2,
            "signedUp": []
        },
        "lesson assistant": {
            "required": 0,
            "signedUp": []
        },
        "sidewalker": {
            "required": 1,
            "signedUp": [
              "5fbbd700f26babade03cbccf"
            ]
        },
        "horse leader": {
            "required": 1,
            "signedUp": []
        }
    },
    "horses": [
        "5fbadbaa113b46b22f8fc578"
    ],
    "notes": "44 lesson",
    "startTime": "16:19",
    "endTime": "17:00"
  }
  ```

2. To create user
  ```
  POST https://jelly-apple-efraasia.glitch.me//users

  {
    "firstName": "Billy",
    "lastName": "Joel",
    "emailId": "billyJ@hm.com",
    "phoneNumber": "1 238 556 890"
  }
  ```

*Note: By default user type is volunteer have been used*

### Other API Calls

1. To get all skills
  ```
  GET https://jelly-apple-efraasia.glitch.me//skills

  {
    "username": "Celestine_Bogan",
    "password": "QEarsM5XBLi83hE"
  }
  ```

2. To add volunteer position(s)
>*Note: Already added skills based on positions*
  ```
  POST https://jelly-apple-efraasia.glitch.me//positions

  [
    {
        "name": "barn crew",
        "skills": [
            "5fba686c5b160dccee9573ce"
        ]
    },
    {
        "name": "sidewalker",
        "skills": [
            "5fba686c5b160dccee9573c7",
            "5fba686c5b160dccee9573c8"
        ]
    },
    {
        "name": "horse leader",
        "skills": [
            "5fba686c5b160dccee9573ca"
        ]
    },
    {
        "name": "lesson assistant",
        "skills": [
            "5fba686c5b160dccee9573c9",
            "5fba686c5b160dccee9573cb",
            "5fba686c5b160dccee9573cc",
            "5fba686c5b160dccee9573cd"
        ]
    }
]
  ```

## 3. Client side

The client uses the following environment variables:

- `NODE_ENV`: changes the behaviour of the application for deployment if set to
  `"production"`
- `REACT_APP_AUTH0_DOMAIN`: the url of an auth0 tenant (no trailing slash) to use for
  authentication
- `REACT_APP_AUTH0_CLIENT_ID`: the client ID of an auth0 application configured on the
  tenant
- `REACT_APP_AUTH0_CLIENT_SECRET`: the client secret associated with that auth0 application
- `REACT_APP_API_SERVER`: The url of the backend API server (no trailing slash).
  For development, this should be `http://localhost:2222`

If `NODE_ENV` is set to "production", environment variables should be set
directly on the host. Otherwise, these variables can be defined in a `.env` file
in the root directory of the client that will be read at runtime. Note that the
prefix `REACT_APP_` is
[needed](https://create-react-app.dev/docs/adding-custom-environment-variables#adding-development-environment-variables-in-env)
for the webpack development server used by react-scripts to read and use an
environment variable from `.env`.

- To Start the app
```
cd client/
npm i && npm start
```
- navigate to `http://localhost:3000`
```
