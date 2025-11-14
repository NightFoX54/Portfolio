package com.berkay.portfolio.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.berkay.portfolio.model.Admin;

public interface AdminRepository extends MongoRepository<Admin, String> {
    Optional<Admin> findByUsername(String username);
    boolean existsByUsername(String username);
}
