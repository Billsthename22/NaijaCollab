package com.naijacollab.backend.web;

import com.naijacollab.backend.dto.export.DataExportRequestResponse;
import com.naijacollab.backend.security.SecurityPrincipalAccessor;
import com.naijacollab.backend.service.DataPortabilityService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users/me")
public class UserDataController {

    private final SecurityPrincipalAccessor principalAccessor;
    private final DataPortabilityService dataPortabilityService;

    public UserDataController(
            SecurityPrincipalAccessor principalAccessor, DataPortabilityService dataPortabilityService) {
        this.principalAccessor = principalAccessor;
        this.dataPortabilityService = dataPortabilityService;
    }

    @PostMapping("/export")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public DataExportRequestResponse requestExport() {
        return dataPortabilityService.requestExport(principalAccessor.requireUserId());
    }

    @GetMapping("/export")
    public List<DataExportRequestResponse> listExportRequests() {
        return dataPortabilityService.listExportRequests(principalAccessor.requireUserId());
    }
}
