# Use Java 17
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Give permission to mvnw (if exists)
RUN chmod +x mvnw || true

# Build the project
RUN ./mvnw clean package || mvn clean package

# Run the app
CMD ["java", "-jar", "target/*.jar"]