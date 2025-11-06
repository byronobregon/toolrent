package mingeso.toolrent.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
  public List<MovementResponseDto> getMovements(
      LocalDate startDate, LocalDate endDate, Long categoryId) {
    LocalDateTime startDateTime = startDate != null ? startDate.atStartOfDay() : null;
    LocalDateTime endDateTime =
        endDate != null ? endDate.atTime(LocalTime.MAX) : null;

    return movementRepository.findByFilters(categoryId, startDateTime, endDateTime).stream()
        .map(MovementResponseDto::from)
        .toList();
  }
}
