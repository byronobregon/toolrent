package mingeso.toolrent.controllers;

import mingeso.toolrent.entities.LoanReturnEntity;
import mingeso.toolrent.services.LoanReturnService;
import mingeso.toolrent.dtos.CreateLoanReturnDto;
import mingeso.toolrent.dtos.LoanReturnResponseDto;
// import mingeso.toolrent.dtos.UpdateLoanReturnDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/loan_returns")
@CrossOrigin("*")
public class LoanReturnController {
  @Autowired
  LoanReturnService LoanReturnService;

  @GetMapping("/")
  public ResponseEntity<List<LoanReturnResponseDto>> listLoanReturns() {
    var loans = LoanReturnService.getLoanReturns().stream().map(LoanReturnResponseDto::from).toList();
    return ResponseEntity.ok(loans);
  }

  //	@GetMapping("/{id}")
  //	public ResponseEntity<LoanReturnResponseDto> getLoanReturnById(@PathVariable Long id) {
  //		LoanReturnEntity LoanReturn = LoanReturnService.getLoanReturnById(id);
  //		return ResponseEntity.ok(LoanReturnResponseDto.from(LoanReturn));
  //	}
  //
  @PostMapping("/")
  public ResponseEntity<LoanReturnEntity> saveLoanReturn(@RequestBody CreateLoanReturnDto dto) {
    dto.setDate(LocalDateTime.now());
    LoanReturnEntity LoanReturnNew = LoanReturnService.saveLoanReturn(dto);
    return ResponseEntity.ok(LoanReturnNew);
  }
  //
  //	@PutMapping("/")
  //	public ResponseEntity<LoanReturnResponseDto> updateLoanReturn(@RequestBody UpdateLoanReturnDto LoanReturn){
  //		System.out.println("\n id: " + LoanReturn.getLoanReturnId() + "\n");
  //		System.out.println("\n name: " + LoanReturn.getName() + "\n");
  //		System.out.println("\n category id: " + LoanReturn.getCategoryId() + "\n");
  //		System.out.println("\n reposition value: " + LoanReturn.getRepositionValue() + "\n");
  //		LoanReturnEntity LoanReturnUpdated = LoanReturnService.updateLoanReturn(LoanReturn);
  //		return ResponseEntity.ok(LoanReturnResponseDto.from(LoanReturnUpdated));
  //	}
  //
  //	@DeleteMapping("/{id}")
  //	public ResponseEntity<Boolean> deleteLoanReturnById(@PathVariable Long id) throws Exception {
  //		LoanReturnService.deleteLoanReturn(id);
  //		return ResponseEntity.noContent().build();
  //	}
}
