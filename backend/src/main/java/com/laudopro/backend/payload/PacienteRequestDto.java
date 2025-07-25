package com.laudopro.backend.payload;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
public class PacienteRequestDto {
    @NotBlank
    private String nome;

    @NotBlank
    @Pattern(regexp = "\\d{11}", message = "CPF deve conter 11 dígitos numéricos")
    private String cpf;

    private String telefone;
    private String endereco;
}