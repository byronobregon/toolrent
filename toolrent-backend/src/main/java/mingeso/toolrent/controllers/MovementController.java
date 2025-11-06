package mingeso.toolrent.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
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
  public ResponseEntity<List<MovementResponseDto>> listMovements() {
    var movements = movementService.getMovements();
    return ResponseEntity.ok(movements);
  }

  @GetMapping("/category/{categoryId}")
  public ResponseEntity<List<MovementResponseDto>> listMovementsByCategory(
      @PathVariable Long categoryId) {
    var movements = movementService.getMovementsByCategory(categoryId);
    return ResponseEntity.ok(movements);
  }
}
