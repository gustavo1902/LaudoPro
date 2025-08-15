package com.laudopro.backend.repository;

import com.laudopro.backend.model.Exame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

public interface ExameRepository extends JpaRepository<Exame, Long>, JpaSpecificationExecutor<Exame> {
    List<Exame> findByPacienteIdOrderByDataDesc(Long pacienteId);
}