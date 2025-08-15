package com.laudopro.backend.service;

import com.laudopro.backend.payload.ExameRequestDto;
import com.laudopro.backend.payload.ExameResponseDto;

import java.time.LocalDate;
import java.util.List;

public interface ExameService {
    ExameResponseDto criarExame(ExameRequestDto exameDto);
    List<ExameResponseDto> listarTodosExames(Long pacienteId, String status, LocalDate data);
    List<ExameResponseDto> listarExamesDoPaciente(String emailUsuario);
    ExameResponseDto buscarExamePorId(Long id);
    ExameResponseDto atualizarExame(Long id, ExameRequestDto exameDto);
    void deletarExame(Long id);
}