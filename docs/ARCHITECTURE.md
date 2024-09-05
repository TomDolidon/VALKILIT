# 🧱 Architecture

## Project's structure

```
┣ 📂.devcontainer
┃ ┣ 📜devcontainer.json
┃ ┗ 📜Dockerfile
┣ 📂.husky -> git commit enhancement
┣ 📂.jhipster -> ?
┣ 📂.mvn -> ?
┣ 📂src
┃ ┣ 📂main -> all SERVER ressources
┃ ┃ ┣ 📂docker -> docker config for tierce services (postgress, sonar, ...)
┃ ┃ ┣ 📂java
┃ ┃ ┃ ┗ 📂com
┃ ┃ ┃   ┗ 📂mycompany
┃ ┃ ┃     ┗ 📂myapp
┃ ┃ ┃       ┣ 📂aop
┃ ┃ ┃       ┃ ┗ 📂logging
┃ ┃ ┃       ┣ 📂config
┃ ┃ ┃       ┣ 📂domain -> here are stored entities
┃ ┃ ┃       ┣ 📂management
┃ ┃ ┃       ┣ 📂repository -> entities repositories
┃ ┃ ┃       ┣ 📂security -> security aspects (roles, jwt handling)
┃ ┃ ┃       ┣ 📂service -> all backend services
┃ ┃ ┃       ┃ ┣ 📂dto -> DTO
┃ ┃ ┃       ┃ ┣ 📂mapper
┃ ┃ ┃       ┣ 📂web
┃ ┃ ┃       ┃ ┣ 📂filter
┃ ┃ ┃       ┃ ┃ ┣ 📜package-info.java
┃ ┃ ┃       ┃ ┃ ┗ 📜SpaWebFilter.java
┃ ┃ ┃       ┃ ┗ 📂rest -> REST controllers
┃ ┃ ┃       ┃   ┣ 📂errors -> custom errors
┃ ┃ ┃       ┃   ┣ 📂vm -> view models
┃ ┃ ┃       ┣ 📜ApplicationWebXml.java
┃ ┃ ┃       ┣ 📜GeneratedByJHipster.java
┃ ┃ ┃       ┣ 📜package-info.java
┃ ┃ ┃       ┗ 📜TestApp2App.java -> entry point
┃ ┃ ┣ 📂resources
┃ ┃ ┃ ┣ 📂config -> server config
┃ ┃ ┃ ┣ 📂i18n -> translations
┃ ┃ ┃ ┣ 📂templates
┃ ┃ ┃ ┣ 📜banner.txt
┃ ┃ ┃ ┗ 📜logback-spring.xml
┃ ┃ ┗ 📂webapp -> all CLIENT ressources
┃ ┃   ┣ 📂app
┃ ┃   ┃ ┣ 📂account -> User account management UI
┃ ┃   ┃ ┣ 📂admin -> Administration UI
┃ ┃   ┃ ┣ 📂config -> Some utilities files
┃ ┃   ┃ ┣ 📂core -> Common building blocks like configuration and interceptors
┃ ┃   ┃ ┣ 📂entities -> Generated entities (more information below)
┃ ┃   ┃ ┣ 📂home -> Home page
┃ ┃   ┃ ┣ 📂layouts -> Common page layouts like navigation bar and error pages
┃ ┃   ┃ ┃ ┗ 📂 main -> Main page
┃ ┃   ┃ ┃ ┃ ┗  📜 main.component.ts -> Main application class
┃ ┃   ┃ ┣ 📂login -> Login page
┃ ┃   ┃ ┣ 📂shared -> Common services like authentication and internationalization
┃ ┃   ┃ ┣ 📜app-page-title-strategy.ts
┃ ┃   ┃ ┣ 📜app.component.ts
┃ ┃   ┃ ┣ 📜app.config.ts
┃ ┃   ┃ ┣ 📜app.constants.ts
┃ ┃   ┃ ┗ 📜app.routes.ts
┃ ┃   ┣ 📂content -> Static content
┃ ┃   ┃ ┣ 📂css -> CSS stylesheets
┃ ┃   ┃ ┣ 📂images -> Images
┃ ┃   ┃ ┗ 📂scss -> Sass style sheet files will be here if you choose the option
┃ ┃   ┣ 📂i18n -> translation files
┃ ┃   ┣ 📂swagger-ui -> Swagger UI front-end
┃ ┃   ┣ 📂WEB-INF
┃ ┃   ┣ 📜404.html
┃ ┃   ┣ 📜bootstrap.ts
┃ ┃   ┣ 📜declarations.d.ts
┃ ┃   ┣ 📜favicon.ico
┃ ┃   ┣ 📜index.html
┃ ┃   ┣ 📜main.ts
┃ ┃   ┣ 📜manifest.webapp
┃ ┃   ┗ 📜robots.txt -> Configuration for bots and Web crawlers
┃ ┗ 📂test -> test for client / server
┣ 📂target
┣ 📂webpack
┃ ┣ 📜environment.js
┃ ┣ 📜logo-jhipster.png
┃ ┣ 📜proxy.conf.js
┃ ┗ 📜webpack.custom.js
┣ 📜.editorconfig
┣ 📜.gitattributes
┣ 📜.gitignore
┣ 📜.lintstagedrc.cjs
┣ 📜.prettierignore
┣ 📜.prettierrc
┣ 📜.yo-rc.json
┣ 📜angular.json
┣ 📜checkstyle.xml
┣ 📜eslint.config.mjs
┣ 📜jest.conf.js
┣ 📜mvnw
┣ 📜mvnw.cmd
┣ 📜ngsw-config.json
┣ 📜npmw
┣ 📜npmw.cmd
┣ 📜package.json
┣ 📜pom.xml
┣ 📜README.md
┣ 📜sonar-project.properties
┣ 📜tsconfig.app.json
┣ 📜tsconfig.json
┗ 📜tsconfig.spec.json
```
