package com.laudopro.backend.specs;

import com.laudopro.backend.model.Exame;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDate;

public class ExameSpecification {

    public static Specification<Exame> comPacienteId(Long pacienteId) {
        return (root, query, criteriaBuilder) -> {
            if (pacienteId == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("paciente").get("id"), pacienteId);
        };
    }

    public static Specification<Exame> comStatus(String status) {
        return (root, query, criteriaBuilder) -> {
            if (status == null || status.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("status"), Exame.StatusExame.valueOf(status.toUpperCase()));
        };
    }

    public static Specification<Exame> comData(LocalDate data) {
        return (root, query, criteriaBuilder) -> {
            if (data == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("data"), data);
        };
    }
}