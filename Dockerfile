FROM maven:3.3.4-openjdk-21  AS  build
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:21.0.1-jdk-slim
COPY --from=build /target/deployDemo-0.0.1-SNAPSHOT.jar deployDemo.jar
EXPOSE 8080
ENTRYPOINT [ "java","-jar","deployDemo.jar" ]