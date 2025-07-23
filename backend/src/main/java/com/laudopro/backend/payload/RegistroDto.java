package com.laudopro.backend.payload;

import lombok.Data;

@Data
public class RegistroDto {
    private String email;
    private String senha;
    private String perfil; 
}