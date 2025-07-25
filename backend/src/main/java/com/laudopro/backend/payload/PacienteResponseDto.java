package com.laudopro.backend.payload;

import lombok.Data;

@Data
public class PacienteResponseDto {
    private Long id;
    private String nome;
    private String cpf;
    private String telefone;
    private String endereco;
}