FROM eclipse-temurin:21-jdk-jammy AS build

WORKDIR /app
COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app
COPY --from=build /app/target/deployDemo-0.0.1-SNAPSHOT.jar deployDemo.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "deployDemo.jar"]

