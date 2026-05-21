package com.maisonmode;

import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class FashionCommerceApiApplication {

    public static void main(String[] args) {
        configureDatasourceFromDatabaseUrl();
        SpringApplication.run(FashionCommerceApiApplication.class, args);
    }

    private static void configureDatasourceFromDatabaseUrl() {
        String explicitDatasourceUrl = System.getenv("SPRING_DATASOURCE_URL");
        String databaseUrl = System.getenv("DATABASE_URL");
        if ((explicitDatasourceUrl != null && !explicitDatasourceUrl.isBlank())
                || databaseUrl == null
                || databaseUrl.isBlank()) {
            return;
        }

        try {
            URI uri = new URI(databaseUrl);
            String scheme = uri.getScheme();
            if (!"postgres".equalsIgnoreCase(scheme) && !"postgresql".equalsIgnoreCase(scheme)) {
                throw new IllegalStateException("DATABASE_URL must use postgres:// or postgresql://");
            }

            StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://").append(uri.getHost());
            if (uri.getPort() > 0) {
                jdbcUrl.append(':').append(uri.getPort());
            }
            jdbcUrl.append(uri.getRawPath());
            if (uri.getRawQuery() != null && !uri.getRawQuery().isBlank()) {
                jdbcUrl.append('?').append(uri.getRawQuery());
            }

            System.setProperty("spring.datasource.url", jdbcUrl.toString());

            if (uri.getRawUserInfo() != null && uri.getRawUserInfo().contains(":")) {
                String[] credentials = uri.getRawUserInfo().split(":", 2);
                System.setProperty("spring.datasource.username", decode(credentials[0]));
                System.setProperty("spring.datasource.password", decode(credentials[1]));
            }
        } catch (URISyntaxException exception) {
            throw new IllegalStateException("DATABASE_URL is not a valid PostgreSQL URL", exception);
        }
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }
}
