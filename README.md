## DocumentMGT REST API
Document management rest api with S3



## Prerequisites

1. [Docker](https://docs.docker.com/get-docker/) , currently i used version 26.0.1, build d260a54


### Clone the project

```
$ git clone git@github.com:mqnoy/document-mgt.git
$ cd document-mgt
$ docker compose up --build
```



### Get Started
1. Open the project directory with code editor eg: [Visual Studio Code](https://code.visualstudio.com/download)
1. Copy `.env.example` to `.env` in root project directory
1. Edit variable on `.env` for detail see the table
   | Variabel          |        description        |  Example value |
   |-------------------|---------------------------|------    |
   | APP_PORT          |  Server listen port       |  3000 |
   | LOG_LEVELS        |  Print log on console, available (error, log, verbose, debug, warning)    |  verbose |
   | JWT_SECRET        | Secret jwt                |  - |
   | JWT_ACCESS_TOKEN_EXPIRY        | expiry access token in seconds (default is 1day)               |    86400 |
   | JWT_REFRESH_TOKEN_EXPIRY    | expiry access token in seconds (default is 7day)                 |    604800 |
   | DATABASE_URL    | Url Postgres DSN       |    "postgresql://postgres:postgres@localhost:5432/documentmgt_db?schema=public" |
   | MINIO_SERVER     | Host S3 service             |    localhost |
   | MINIO_PORT     | Port S3 service             |    9000 |
   | MINIO_SSL     | false/true             |    localhost |
   | MINIO_ACCESS_KEY     | username or access key             |    minio |
   | MINIO_SECRET_KEY     | secret or password             |    1234567890 |
   | MINIO_BUCKET     | Bucket name             |    document-management |

1. Open the terminal 
1. Install dependencies type in terminal `npm install`
1. Back to terminal in vscode then run migration 
   ```
   npm run db:sync
   npm run db:up
   ```
1. Run service `npm run start`


### TODO 
- [ ] Support with rbac


### Postman Collection
- [collection](https://www.postman.com/imzalab-preview/workspace/team-workspace/collection/32128861-aaf19ed1-5531-4038-b843-912c585092a1?action=share&creator=32128861&active-environment=32128861-db03591a-0eb3-479f-ac95-2ac962a758c7)


### Contributor
- [Rifky](https://github.com/mqnoy/)