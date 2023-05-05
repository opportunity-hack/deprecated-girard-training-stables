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
We use Atlas (MongoDB service) free-tier (M0) to host our database.  Create an account/database over at https://cloud.mongodb.com/

## 1. Create a .env file
In ./server, create a .env file that will allow NodeJS to read environment variables, add these variables.
```
ATLAS_URI=mongodb+srv://<username>:<password>@<URI>/?retryWrites=true&w=majority
PORT=2222
EMAIL=test@something.com
PASSWORD=daklsdjad
MAIN_URL=www.ohack.org
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

- To Start the app
```
cd client/
npm i && npm start
```
- navigate to `http://localhost:3000`
```
