package com.laudopro.backend.config;

import com.laudopro.backend.model.Usuario;
import com.laudopro.backend.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUserInitializer implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminUserInitializer.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        logger.info("Verificando a existência do usuário admin padrão...");

        if (!usuarioRepository.existsByEmail(adminEmail)) {
            logger.info("Usuário admin padrão não encontrado. Criando novo usuário admin...");

            Usuario adminUser = new Usuario();
            adminUser.setEmail(adminEmail);
            adminUser.setSenha(passwordEncoder.encode(adminPassword));
            adminUser.setPerfil(Usuario.Perfil.ADMIN);

            usuarioRepository.save(adminUser);
            logger.info("Usuário admin padrão criado com sucesso. Email: {}", adminEmail);
        } else {
            logger.info("Usuário admin padrão já existe.");
        }
    }
}