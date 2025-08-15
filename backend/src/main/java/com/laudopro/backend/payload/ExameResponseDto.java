package com.laudopro.backend.payload;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ExameResponseDto {

    private Long id;
    private String tipo;
    private LocalDate data;
    private String status;
    private String resultado;
    private String observacoes;
    private PacienteInfo paciente;

    @Data
    public static class PacienteInfo {
        private Long id;
        private String nome;
    }
}