package com.naijacollab.backend.service;

import com.naijacollab.backend.domain.SkillEntity;
import com.naijacollab.backend.dto.profile.SkillDto;
import com.naijacollab.backend.repository.SkillRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Transactional(readOnly = true)
    public List<SkillDto> getAllActiveSkills() {
        return skillRepository.findAll().stream()
                .filter(SkillEntity::isActive)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SkillEntity getOrCreateSkill(String skillName) {
        if (skillName == null || skillName.trim().isEmpty()) {
            throw new IllegalArgumentException("Skill name cannot be empty");
        }
        String slug = skillName.trim().toLowerCase().replaceAll("[^a-z0-9]+", "-");
        
        return skillRepository.findBySlug(slug).orElseGet(() -> {
            SkillEntity newSkill = new SkillEntity();
            newSkill.setId(UUID.randomUUID());
            newSkill.setName(skillName.trim());
            newSkill.setSlug(slug);
            newSkill.setCategory("Custom");
            newSkill.setActive(true);
            return skillRepository.save(newSkill);
        });
    }

    private SkillDto toDto(SkillEntity entity) {
        return new SkillDto(
                entity.getId(),
                entity.getSlug(),
                entity.getName(),
                entity.getCategory(),
                entity.isActive()
        );
    }
}
