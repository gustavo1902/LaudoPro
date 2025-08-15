package com.laudopro.backend.service.impl;

import com.laudopro.backend.exception.ResourceNotFoundException;
import com.laudopro.backend.model.Exame;
import com.laudopro.backend.model.Paciente;
import com.laudopro.backend.model.Usuario;
import com.laudopro.backend.payload.ExameRequestDto;
import com.laudopro.backend.payload.ExameResponseDto;
import com.laudopro.backend.repository.ExameRepository;
import com.laudopro.backend.repository.PacienteRepository;
import com.laudopro.backend.repository.UsuarioRepository;
import com.laudopro.backend.service.ExameService;
import com.laudopro.backend.specs.ExameSpecification;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExameServiceImpl implements ExameService {

    @Autowired
    private ExameRepository exameRepository;
    @Autowired
    private PacienteRepository pacienteRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ExameResponseDto criarExame(ExameRequestDto exameDto) {
        Paciente paciente = pacienteRepository.findById(exameDto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente", "id", exameDto.getPacienteId()));

        Exame exame = modelMapper.map(exameDto, Exame.class);
        exame.setPaciente(paciente);
        exame.setStatus(Exame.StatusExame.PENDENTE); 

        Exame novoExame = exameRepository.save(exame);
        return modelMapper.map(novoExame, ExameResponseDto.class);
    }

    @Override
    public List<ExameResponseDto> listarTodosExames(Long pacienteId, String status, LocalDate data) {
        Specification<Exame> spec = Specification.where(ExameSpecification.comPacienteId(pacienteId))
                .and(ExameSpecification.comStatus(status))
                .and(ExameSpecification.comData(data));
        
        List<Exame> exames = exameRepository.findAll(spec);
        return exames.stream()
                .map(exame -> modelMapper.map(exame, ExameResponseDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ExameResponseDto> listarExamesDoPaciente(String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", "email", emailUsuario));
        Long pacienteId = 1L; 
        List<Exame> exames = exameRepository.findByPacienteIdOrderByDataDesc(pacienteId);

        return exames.stream()
                .map(exame -> modelMapper.map(exame, ExameResponseDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public ExameResponseDto buscarExamePorId(Long id) {
        Exame exame = exameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exame", "id", id));
        return modelMapper.map(exame, ExameResponseDto.class);
    }

    @Override
    public ExameResponseDto atualizarExame(Long id, ExameRequestDto exameDto) {
        Exame exame = exameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exame", "id", id));

        if(exameDto.getStatus() != null) {
            exame.setStatus(Exame.StatusExame.valueOf(exameDto.getStatus().toUpperCase()));
        }
        if(exameDto.getResultado() != null) {
            exame.setResultado(exameDto.getResultado());
        }
        if(exameDto.getObservacoes() != null) {
            exame.setObservacoes(exameDto.getObservacoes());
        }

        Exame exameAtualizado = exameRepository.save(exame);
        return modelMapper.map(exameAtualizado, ExameResponseDto.class);
    }

    @Override
    public void deletarExame(Long id) {
        Exame exame = exameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exame", "id", id));
        exameRepository.delete(exame);
    }
}