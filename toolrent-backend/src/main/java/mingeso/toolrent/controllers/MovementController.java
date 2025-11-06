package mingeso.toolrent.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mingeso.toolrent.dtos.MovementResponseDto;
import mingeso.toolrent.services.MovementService;

@RestController
@RequestMapping("/api/v1/movements")
@CrossOrigin("*")
public class MovementController {

  @Autowired
  MovementService movementService;

  @GetMapping("/")
  public ResponseEntity<List<MovementResponseDto>> listMovements(
      @RequestParam(required = false)
          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate startDate,
      @RequestParam(required = false)
          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate endDate,
      @RequestParam(required = false) Long categoryId) {
    var movements = movementService.getMovements(startDate, endDate, categoryId);
    return ResponseEntity.ok(movements);
  }

  @GetMapping("/category/{categoryId}")
  public ResponseEntity<List<MovementResponseDto>> listMovementsByCategory(
      @PathVariable Long categoryId,
      @RequestParam(required = false)
          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate startDate,
      @RequestParam(required = false)
          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate endDate) {
    var movements = movementService.getMovements(startDate, endDate, categoryId);
    return ResponseEntity.ok(movements);
  }
}
