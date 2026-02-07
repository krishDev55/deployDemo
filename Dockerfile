
FROM eclipse-temurin:21-jdk-jammy AS build
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy
COPY --from=build /target/deployDemo-0.0.1-SNAPSHOT.jar deployDemo.jar
EXPOSE 8080

ENTRYPOINT [ "java","-jar","deployDemo.jar" ]
