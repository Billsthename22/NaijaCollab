package com.naijacollab.backend;

import static org.hamcrest.Matchers.hasKey;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AuthApiContractTest {

    @Autowired private MockMvc mockMvc;

    @Test
    void registerResponseContainsStableContractFields() throws Exception {
        String body =
                """
                {
                  "email":"contract@example.com",
                  "password":"C0ntract!Pass2026",
                  "username":"contract_user",
                  "displayName":"Contract User"
                }
                """;
        mockMvc.perform(
                        post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user").exists())
                .andExpect(jsonPath("$.user.id").exists())
                .andExpect(jsonPath("$.user.email").value("contract@example.com"))
                .andExpect(jsonPath("$.user.username").value("contract_user"))
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andExpect(jsonPath("$.accessTokenExpiresInSeconds").isNumber())
                .andExpect(jsonPath("$", not(hasKey("passwordHash"))))
                .andExpect(jsonPath("$", not(hasKey("password"))));
    }
}
