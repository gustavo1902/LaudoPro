package com.laudopro.backend.payload;

import lombok.Data;

@Data
public class LoginDto {
    private String email;
    private String senha;
}