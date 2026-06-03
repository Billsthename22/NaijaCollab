package com.naijacollab.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "matches")
public class MatchEntity {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id_a", nullable = false)
    private UserEntity userA;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id_b", nullable = false)
    private UserEntity userB;

    @Column(name = "score", nullable = false)
    private Double score;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "reasons_jsonb", columnDefinition = "jsonb")
    private String reasonsJsonb;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UserEntity getUserA() {
        return userA;
    }

    public void setUserA(UserEntity userA) {
        this.userA = userA;
    }

    public UserEntity getUserB() {
        return userB;
    }

    public void setUserB(UserEntity userB) {
        this.userB = userB;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getReasonsJsonb() {
        return reasonsJsonb;
    }

    public void setReasonsJsonb(String reasonsJsonb) {
        this.reasonsJsonb = reasonsJsonb;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
