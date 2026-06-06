package com.naijacollab.backend;

import static org.assertj.core.api.Assertions.assertThat;

import com.naijacollab.backend.domain.UserEntity;
import com.naijacollab.backend.repository.UserRepository;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
class SoftDeleteBehaviorTest {

    @Autowired private UserRepository userRepository;

    @Test
    @Transactional
    void softDeletedUserIsHiddenFromDefaultQueriesButStillExistsInStorage() {
        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID());
        user.setEmail("softdelete@example.com");
        user.setUsername("softdelete_user");
        user.setDisplayName("Soft Delete User");
        user.setPasswordHash("hashed-value");
        userRepository.saveAndFlush(user);

        userRepository.delete(user);
        userRepository.flush();

        assertThat(userRepository.findByEmailIgnoreCase("softdelete@example.com")).isEmpty();
        assertThat(userRepository.findIncludingDeletedByEmail("softdelete@example.com")).isPresent();
    }
}
