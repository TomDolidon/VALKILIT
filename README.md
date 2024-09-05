# VALKYLIT - JHipster E-COMMERCE PROJECT

## 🧑‍💻 **Description**

This repo contain all code for M2 GI Ecommerce project

Valkylit is a jhipster monolithic project using :

- Angular for client-side application
- Java Spring Boot for server-side application
- PostgreSQL databse

## 🎉 **Getting started**

### 💿 **Prerequisites**

- Node.js LTS
- Java 17 or 21 LTS
- postgres (optionnal to handle db)
- docker (used for build)

### 📦 **Installation**

**Client-side setup :**

open a terminal in the root project directory and run :

```
npm i
```

**Server-side setup :**

open a terminal in the root project directory and run :

```
./mvnw install
```

**Database setup :**

There is two way to handle database setup

**_1. Configure local postgres data base :_**

Create DB (above the database valkylit owned by user postgres)

```
psql -U postgres
CREATE DATABASE valkylit;
```

change src/main/ressources/config/application-dev.yml configuration :

```
  datasource:
    type: com.zaxxer.hikari.HikariDataSource
    url: jdbc:postgresql://localhost:5432/{db_name}
    username: {user_name}
    password:
```

TODO ADD FIXTURES SCRIPT TO LOAD MOCKED DATA

**_2. Or run db in docker container :_**

change server configuration :

TODO

then run :

```
docker-compose -f src/main/docker/app.yml up
```

## ⏯️ **Startup**

Terminal 1 : `npm start`

Terminal 2 : `./mvnw`

Start postgres server or run the databse container

## 🚀 **Deployment**

TODO

## 📝 **Documentation**

### Devs

- [Project architecture](./docs/ARCHITECTURE.md)

- [Troobleshooting](./docs/TROOBLESHOOTING.md)

- [Known issues](./docs/KNOWN_ISSUES.md)

- [Versionning](./docs/VERSIONING.md)

- [Changelog](./docs/CHANGELOG.md)

- [Jhipster default readme](./docs/JHIPSTER.md)

## 🔗 Useful links

- [JHipster officail doc](https://www.jhipster.tech/getting-started)
- [Angular official doc](https://angular.dev/overview)
- [Java Sping boot offical doc](https://spring.io/projects/spring-boot)
