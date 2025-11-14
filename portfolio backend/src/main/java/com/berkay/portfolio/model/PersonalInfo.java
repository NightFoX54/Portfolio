package com.berkay.portfolio.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Document("personal_info")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PersonalInfo {
    @Id
    private String id;
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^\\d{10,11}$", message = "Invalid phone number (10-11 digits)")
    private String phone;
    @NotBlank(message = "Address is required")
    private String address;
    @NotBlank(message = "City is required")
    private String city;
    @NotBlank(message = "State is required")
    private String state;
    @NotBlank(message = "Zip is required")
    @Pattern(regexp = "^\\d{5}$", message = "Invalid zip code")
    private String zip;
    @NotBlank(message = "Country is required")
    private String country;
    private String profilePicture;
    private String resume;

    private String workTitle;
    
}
