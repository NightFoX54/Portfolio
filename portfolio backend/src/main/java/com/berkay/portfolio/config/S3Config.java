package com.berkay.portfolio.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.http.SdkHttpClient;
import software.amazon.awssdk.http.apache.ApacheHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Config {

    @Value("${aws.s3.region}")
    private String region;

    @Value("${aws.access-key-id:}")
    private String accessKeyId;

    @Value("${aws.secret-access-key:}")
    private String secretAccessKey;

    @Bean
    public S3Client s3Client() {
        // Explicitly use Apache HTTP client to avoid conflicts
        SdkHttpClient httpClient = ApacheHttpClient.builder().build();
        
        if (accessKeyId.isEmpty() || secretAccessKey.isEmpty()) {
            // Use default credentials provider (IAM roles, environment variables, etc.)
            return S3Client.builder()
                    .region(Region.of(region))
                    .httpClient(httpClient)
                    .build();
        } else {
            // Use explicit credentials
            AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKeyId, secretAccessKey);
            return S3Client.builder()
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                    .httpClient(httpClient)
                    .build();
        }
    }
}
