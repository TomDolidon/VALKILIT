# Troobleshooting

Here's a list of all common dev issues and how to solve them :

- When lauching ./mvnw :

ExceptionHandlerExceptionResolver : Resolved [org.springframework.dao.DataIntegrityViolationException: Could not extract column [2] from JDBC ResultSet [Mauvaise valeur pour le type long : JHipster is a development platform to generate, develop and deploy Spring Boot + Angular / React / Vue Web applications and Spring microservices.] [n/a]; SQL [n/a]]

It's due to JHipster error on blob in databse (text and files) : remove @Lob in java Entity's field
