package com.laudopro.backend.controller;

import com.laudopro.backend.payload.PacienteRequestDto;
import com.laudopro.backend.payload.PacienteResponseDto;
import com.laudopro.backend.service.PacienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api") 
@CrossOrigin(origins = "http://localhost:4200")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/pacientes")
    public ResponseEntity<PacienteResponseDto> criarPaciente(@Valid @RequestBody PacienteRequestDto pacienteDto) {
        PacienteResponseDto novoPaciente = pacienteService.criarPaciente(pacienteDto);
        return new ResponseEntity<>(novoPaciente, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/pacientes")
    public ResponseEntity<List<PacienteResponseDto>> listarTodosPacientes() {
        List<PacienteResponseDto> pacientes = pacienteService.listarTodosPacientes();
        return ResponseEntity.ok(pacientes);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/pacientes/{id}")
    public ResponseEntity<PacienteResponseDto> buscarPacientePorId(@PathVariable Long id) {
        PacienteResponseDto paciente = pacienteService.buscarPacientePorId(id);
        return ResponseEntity.ok(paciente);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/pacientes/{id}")
    public ResponseEntity<PacienteResponseDto> atualizarPaciente(@PathVariable Long id, @Valid @RequestBody PacienteRequestDto pacienteDto) {
        PacienteResponseDto pacienteAtualizado = pacienteService.atualizarPaciente(id, pacienteDto);
        return ResponseEntity.ok(pacienteAtualizado);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/pacientes/{id}")
    public ResponseEntity<String> deletarPaciente(@PathVariable Long id) {
        pacienteService.deletarPaciente(id);
        return new ResponseEntity<>("Paciente deletado com sucesso!", HttpStatus.OK);
    }

    @PreAuthorize("hasRole('PACIENTE')")
    @GetMapping("/pacientes/me")
    public ResponseEntity<PacienteResponseDto> buscarMeuPaciente(Authentication authentication) {
        PacienteResponseDto paciente = pacienteService.buscarPacientePorUsuarioAutenticado(authentication.getName());
        return ResponseEntity.ok(paciente);
    }

    @PreAuthorize("hasRole('PACIENTE')")
    @PutMapping("/pacientes/me")
    public ResponseEntity<PacienteResponseDto> atualizarMeuPaciente(Authentication authentication, @Valid @RequestBody PacienteRequestDto pacienteDto) {
        PacienteResponseDto pacienteAtualizado = pacienteService.atualizarPacientePorUsuarioAutenticado(authentication.getName(), pacienteDto);
        return ResponseEntity.ok(pacienteAtualizado);
    }
}