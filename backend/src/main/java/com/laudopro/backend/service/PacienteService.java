package com.laudopro.backend.service;

import com.laudopro.backend.payload.PacienteRequestDto;
import com.laudopro.backend.payload.PacienteResponseDto;

import java.util.List;

public interface PacienteService {
    PacienteResponseDto criarPaciente(PacienteRequestDto pacienteDto);
    List<PacienteResponseDto> listarTodosPacientes();
    PacienteResponseDto buscarPacientePorId(Long id);
    PacienteResponseDto atualizarPaciente(Long id, PacienteRequestDto pacienteDto);
    void deletarPaciente(Long id);
    PacienteResponseDto buscarPacientePorUsuarioAutenticado(String emailUsuario);
    PacienteResponseDto atualizarPacientePorUsuarioAutenticado(String emailUsuario, PacienteRequestDto pacienteDto);
}