package com.laudopro.backend.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ExameRequestDto {

    @NotBlank(message = "O tipo do exame é obrigatório.")
    private String tipo;

    @NotNull(message = "A data do exame é obrigatória.")
    private LocalDate data;
    
    @NotNull(message = "O ID do paciente é obrigatório.")
    private Long pacienteId;

    private String status;
    private String resultado;
    private String observacoes;
}