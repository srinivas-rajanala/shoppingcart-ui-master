FROM maven:3.5-jdk-8
#FROM java:8
#ADD ["target/shoppingcart-ui-0.0.1-SNAPSHOT-exec.jar", "app.jar"]
COPY ./ ./
EXPOSE 8080 8181
ENV JAVA_OPTS="-Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=8181,suspend=n"
#RUN sh -c 'touch /app.jar'
RUN mvn package -DskipTests=true
ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -Dspring.profiles.active=docker -jar ./target/shoppingcart-ui-0.0.1-SNAPSHOT-exec.jar" ]
