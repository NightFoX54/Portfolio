package com.berkay.portfolio.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.berkay.portfolio.model.PersonalInfo;

public interface PersonalInfoRepository extends MongoRepository<PersonalInfo, String> {
    PersonalInfo findByName(String name);
    PersonalInfo findByEmail(String email);
    PersonalInfo findByPhone(String phone);
    PersonalInfo findByAddress(String address);
    PersonalInfo findByCity(String city);
    PersonalInfo findByState(String state);
    PersonalInfo findByZip(String zip);
    PersonalInfo findByCountry(String country);
    PersonalInfo findByProfilePicture(String profilePicture);
    PersonalInfo findByResume(String resume);
}
