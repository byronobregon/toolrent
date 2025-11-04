package mingeso.toolrent.controllers;

import mingeso.toolrent.dtos.CreateRepairDto;
import mingeso.toolrent.dtos.RepairResponseDto;
import mingeso.toolrent.entities.RepairEntity;
import mingeso.toolrent.services.RepairService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/repairs")
@CrossOrigin("*")
public class RepairController {
  @Autowired
  RepairService repairService;

  @GetMapping("/")
  public ResponseEntity<List<RepairResponseDto>> listRepairs() {
    var repairs = repairService.getRepairs().stream().map(RepairResponseDto::from).toList();
    return ResponseEntity.ok(repairs);
  }

  @PostMapping("/")
  public ResponseEntity<RepairResponseDto> saveRepair(@RequestBody CreateRepairDto dto) {
    RepairEntity repair = repairService.saveRepair(dto);
    return ResponseEntity.ok(RepairResponseDto.from(repair));
  }
}
