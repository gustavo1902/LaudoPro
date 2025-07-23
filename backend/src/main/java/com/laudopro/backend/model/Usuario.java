package com.laudopro.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "usuarios")
@Data 
@NoArgsConstructor 
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String senha; // Será armazenada criptografada

    @Enumerated(EnumType.STRING) // Armazena o enum como String no DB
    @Column(nullable = false)
    private Perfil perfil; // ADMIN ou PACIENTE

    // Enum para Perfil
    public enum Perfil {
        ADMIN,
        PACIENTE
    }
}