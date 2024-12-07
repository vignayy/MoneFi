package com.finance.user.repository;

import com.finance.user.model.ProfileModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<ProfileModel,Integer> {

    public ProfileModel findByUserId(int userId);
}

