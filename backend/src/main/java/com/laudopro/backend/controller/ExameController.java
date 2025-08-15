package com.laudopro.backend.controller;

import com.laudopro.backend.payload.ExameRequestDto;
import com.laudopro.backend.payload.ExameResponseDto;
import com.laudopro.backend.service.ExameService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class ExameController {

    @Autowired
    private ExameService exameService;

    @PostMapping("/admin/exames")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExameResponseDto> criarExame(@Valid @RequestBody ExameRequestDto exameDto) {
        ExameResponseDto novoExame = exameService.criarExame(exameDto);
        return new ResponseEntity<>(novoExame, HttpStatus.CREATED);
    }

    @GetMapping("/admin/exames")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ExameResponseDto>> listarTodosExames(
            @RequestParam(required = false) Long pacienteId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        List<ExameResponseDto> exames = exameService.listarTodosExames(pacienteId, status, data);
        return ResponseEntity.ok(exames);
    }

    @GetMapping("/admin/exames/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExameResponseDto> buscarExamePorId(@PathVariable Long id) {
        ExameResponseDto exame = exameService.buscarExamePorId(id);
        return ResponseEntity.ok(exame);
    }

    @PutMapping("/admin/exames/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExameResponseDto> atualizarExame(@PathVariable Long id, @RequestBody ExameRequestDto exameDto) {
        ExameResponseDto exameAtualizado = exameService.atualizarExame(id, exameDto);
        return ResponseEntity.ok(exameAtualizado);
    }

    @DeleteMapping("/admin/exames/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deletarExame(@PathVariable Long id) {
        exameService.deletarExame(id);
        return ResponseEntity.ok("Exame deletado com sucesso.");
    }

    @GetMapping("/paciente/meus-exames")
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<List<ExameResponseDto>> listarMeusExames(Authentication authentication) {
        List<ExameResponseDto> exames = exameService.listarExamesDoPaciente(authentication.getName());
        return ResponseEntity.ok(exames);
    }
}