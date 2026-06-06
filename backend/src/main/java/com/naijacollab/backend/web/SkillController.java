package com.naijacollab.backend.web;

import com.naijacollab.backend.dto.profile.SkillDto;
import com.naijacollab.backend.service.SkillService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public List<SkillDto> getAllSkills() {
        return skillService.getAllActiveSkills();
    }
}
