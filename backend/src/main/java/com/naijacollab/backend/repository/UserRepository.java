package com.naijacollab.backend.repository;

import com.naijacollab.backend.domain.UserEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {

    @Query("select count(u) > 0 from UserEntity u where lower(u.email) = lower(:email)")
    boolean existsByEmailIgnoreCase(@Param("email") String email);

    @Query("select count(u) > 0 from UserEntity u where lower(u.username) = lower(:username)")
    boolean existsByUsernameIgnoreCase(@Param("username") String username);

    @Query("select u from UserEntity u where lower(u.email) = lower(:email)")
    Optional<UserEntity> findByEmailIgnoreCase(@Param("email") String email);

    @Query(
            value = "select * from users u where lower(u.email) = lower(:email) limit 1",
            nativeQuery = true)
    Optional<UserEntity> findIncludingDeletedByEmail(@Param("email") String email);
}
