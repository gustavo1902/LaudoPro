package com.laudopro.backend.service.impl;

import com.laudopro.backend.exception.ResourceNotFoundException;
import com.laudopro.backend.exception.DuplicateResourceException;
import com.laudopro.backend.model.Paciente;
import com.laudopro.backend.model.Usuario;
import com.laudopro.backend.repository.PacienteRepository;
import com.laudopro.backend.repository.UsuarioRepository;
import com.laudopro.backend.payload.PacienteRequestDto;
import com.laudopro.backend.payload.PacienteResponseDto;
import com.laudopro.backend.service.PacienteService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PacienteServiceImpl implements PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public PacienteResponseDto criarPaciente(PacienteRequestDto pacienteDto) {
        if (pacienteRepository.existsByCpf(pacienteDto.getCpf())) {
            throw new DuplicateResourceException("Paciente", "cpf", pacienteDto.getCpf());
        }
        Paciente paciente = modelMapper.map(pacienteDto, Paciente.class);
        Paciente novoPaciente = pacienteRepository.save(paciente);
        return modelMapper.map(novoPaciente, PacienteResponseDto.class);
    }

    @Override
    public List<PacienteResponseDto> listarTodosPacientes() {
        List<Paciente> pacientes = pacienteRepository.findAll();
        return pacientes.stream()
                .map(paciente -> modelMapper.map(paciente, PacienteResponseDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public PacienteResponseDto buscarPacientePorId(Long id) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente", "id", id));
        return modelMapper.map(paciente, PacienteResponseDto.class);
    }

    @Override
    public PacienteResponseDto atualizarPaciente(Long id, PacienteRequestDto pacienteDto) {
        Paciente pacienteExistente = pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente", "id", id));

        if (!pacienteExistente.getCpf().equals(pacienteDto.getCpf()) && pacienteRepository.existsByCpf(pacienteDto.getCpf())) {
            throw new DuplicateResourceException("Paciente", "cpf", pacienteDto.getCpf());
        }

        modelMapper.map(pacienteDto, pacienteExistente);
        Paciente pacienteAtualizado = pacienteRepository.save(pacienteExistente);
        return modelMapper.map(pacienteAtualizado, PacienteResponseDto.class);
    }

    @Override
    public void deletarPaciente(Long id) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente", "id", id));
        pacienteRepository.delete(paciente);
    }

    @Override
    public PacienteResponseDto buscarPacientePorUsuarioAutenticado(String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "email", emailUsuario));

        return pacienteRepository.findAll().stream()
                .map(p -> modelMapper.map(p, PacienteResponseDto.class))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Nenhum paciente encontrado para o usuário.", "email", emailUsuario));
    }

    @Override
    public PacienteResponseDto atualizarPacientePorUsuarioAutenticado(String emailUsuario, PacienteRequestDto pacienteDto) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "email", emailUsuario));

        Paciente pacienteExistente = pacienteRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Nenhum paciente encontrado para o usuário.", "email", emailUsuario));

        if (!pacienteExistente.getCpf().equals(pacienteDto.getCpf()) && pacienteRepository.existsByCpf(pacienteDto.getCpf())) {
            throw new DuplicateResourceException("Paciente", "cpf", pacienteDto.getCpf());
        }

        pacienteExistente.setNome(pacienteDto.getNome());
        pacienteExistente.setTelefone(pacienteDto.getTelefone());
        pacienteExistente.setEndereco(pacienteDto.getEndereco());

        Paciente pacienteAtualizado = pacienteRepository.save(pacienteExistente);
        return modelMapper.map(pacienteAtualizado, PacienteResponseDto.class);
    }
}
