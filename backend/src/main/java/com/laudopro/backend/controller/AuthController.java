package com.laudopro.backend.controller;

import com.laudopro.backend.model.Usuario;
import com.laudopro.backend.payload.LoginDto;
import com.laudopro.backend.payload.RegistroDto;
import com.laudopro.backend.repository.UsuarioRepository;
import com.laudopro.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") 
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<String> authenticateUser(@RequestBody LoginDto loginDto){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getEmail(), loginDto.getSenha()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        return new ResponseEntity<>("Bearer " + token, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegistroDto registroDto){
        
        if(usuarioRepository.existsByEmail(registroDto.getEmail())){
            return new ResponseEntity<>("Email já registrado!", HttpStatus.BAD_REQUEST);
        }

        Usuario usuario = new Usuario();
        usuario.setEmail(registroDto.getEmail());
        usuario.setSenha(passwordEncoder.encode(registroDto.getSenha()));

        try {
            usuario.setPerfil(Usuario.Perfil.valueOf(registroDto.getPerfil().toUpperCase()));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Perfil inválido. Perfil deve ser 'ADMIN' ou 'PACIENTE'.", HttpStatus.BAD_REQUEST);
        }

        usuarioRepository.save(usuario);

        return new ResponseEntity<>("Usuário registrado com sucesso!", HttpStatus.OK);
    }
}