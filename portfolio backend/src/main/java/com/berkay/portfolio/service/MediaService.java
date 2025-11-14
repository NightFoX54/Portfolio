package com.berkay.portfolio.service;

import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

@Service
public class MediaService {

    @Autowired
    private S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    @Value("${aws.access-key-id:}")
    private String accessKeyId;

    @Value("${aws.secret-access-key:}")
    private String secretAccessKey;

    @Value("${aws.s3.presigned-url-expiration:3600}") // Default 1 hour
    private long presignedUrlExpirationSeconds;

    /**
     * Uploads a file to S3 and returns the S3 key (not a public URL)
     * The key should be stored in the database, and presigned URLs should be generated when needed
     */
    public String uploadFile(MultipartFile file, String folder) {
        try {
            String fileName = generateFileName(file.getOriginalFilename());
            String key = folder + "/" + fileName;

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(
                    file.getInputStream(), file.getSize()));

            // Return the S3 key instead of public URL
            // Format: folder/filename (e.g., "profile-pictures/uuid_filename.jpg")
            key = "https://" + bucketName + ".s3.amazonaws.com/" + key;
            return key;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    /**
     * Generates a presigned URL for accessing a private S3 object
     * @param s3Key The S3 key (e.g., "profile-pictures/uuid_filename.jpg")
     * @return Presigned URL that expires after configured time
     */
    public String getPresignedUrl(String s3Key) {
        try {
            // If the key is already a full URL, extract just the key
            String key = extractKeyFromUrlOrKey(s3Key);

            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            // Create presigner with same credentials as S3Client
            S3Presigner presigner = createPresigner();

            PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(
                    GetObjectPresignRequest.builder()
                            .signatureDuration(Duration.ofSeconds(presignedUrlExpirationSeconds))
                            .getObjectRequest(getObjectRequest)
                            .build());

            return presignedRequest.url().toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate presigned URL", e);
        }
    }

    /**
     * Deletes a file from S3
     * @param fileUrlOrKey Can be either a full S3 URL or just the S3 key
     */
    public void deleteFile(String fileUrlOrKey) {
        try {
            // Extract key from URL or use as-is if already a key
            String key = extractKeyFromUrlOrKey(fileUrlOrKey);
            
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file", e);
        }
    }

    /**
     * Creates an S3Presigner with the same credentials as S3Client
     */
    private S3Presigner createPresigner() {
        if (accessKeyId.isEmpty() || secretAccessKey.isEmpty()) {
            // Use default credentials provider
            return S3Presigner.builder()
                    .region(software.amazon.awssdk.regions.Region.of(region))
                    .build();
        } else {
            // Use explicit credentials
            software.amazon.awssdk.auth.credentials.AwsBasicCredentials awsCredentials = 
                software.amazon.awssdk.auth.credentials.AwsBasicCredentials.create(accessKeyId, secretAccessKey);
            return S3Presigner.builder()
                    .region(software.amazon.awssdk.regions.Region.of(region))
                    .credentialsProvider(software.amazon.awssdk.auth.credentials.StaticCredentialsProvider.create(awsCredentials))
                    .build();
        }
    }

    private String generateFileName(String originalFileName) {
        return UUID.randomUUID().toString() + "_" + originalFileName;
    }

    /**
     * Extracts S3 key from URL or returns as-is if already a key
     * Handles both formats:
     * - Full URL: https://bucket-name.s3.amazonaws.com/folder/filename
     * - S3 Key: folder/filename
     */
    private String extractKeyFromUrlOrKey(String fileUrlOrKey) {
        // If it's already just a key (no http/https), return as-is
        if (!fileUrlOrKey.startsWith("http://") && !fileUrlOrKey.startsWith("https://")) {
            return fileUrlOrKey;
        }

        // Extract key from S3 URL
        // URL format: https://bucket-name.s3.amazonaws.com/folder/filename
        // or: https://bucket-name.s3.region.amazonaws.com/folder/filename
        try {
            URI uri = URI.create(fileUrlOrKey);
            String path = uri.getPath();
            // Remove leading slash
            return path.startsWith("/") ? path.substring(1) : path;
        } catch (Exception e) {
            // Fallback: try to extract manually
            String[] parts = fileUrlOrKey.split("/");
            if (parts.length >= 2) {
                // Get last two parts (folder/filename)
                return parts[parts.length - 2] + "/" + parts[parts.length - 1];
            }
            throw new RuntimeException("Invalid S3 URL or key format: " + fileUrlOrKey);
        }
    }
}
