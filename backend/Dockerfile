FROM openjdk:23-jdk-slim

WORKDIR /app
COPY /build/libs/Disziplin-all.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]