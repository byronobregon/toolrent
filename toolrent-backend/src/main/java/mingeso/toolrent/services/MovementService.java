package mingeso.toolrent.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mingeso.toolrent.dtos.MovementResponseDto;
import mingeso.toolrent.repositories.MovementRepository;

@Service
public class MovementService {

  @Autowired
  MovementRepository movementRepository;

  @Transactional(readOnly = true)
  public List<MovementResponseDto> getMovements() {
    return movementRepository.findAllByOrderByMovementIdDesc().stream()
        .map(MovementResponseDto::from)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<MovementResponseDto> getMovementsByCategory(Long categoryId) {
    return movementRepository.findByToolCategoryId(categoryId).stream()
        .map(MovementResponseDto::from)
        .toList();
  }
}
