package mingeso.toolrent.controllers;

import mingeso.toolrent.entities.LoanEntity;
import mingeso.toolrent.services.LoanService;
import mingeso.toolrent.dtos.CreateLoanDto;
import mingeso.toolrent.dtos.LoanResponseDto;
// import mingeso.toolrent.dtos.UpdateLoanDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/loans")
@CrossOrigin("*")
public class LoanController {
    @Autowired
	LoanService LoanService;

    @GetMapping("/")
	public ResponseEntity<List<LoanResponseDto>> listLoans() {
    	var loans = LoanService.getLoans().stream().map(LoanResponseDto::from).toList();
		return ResponseEntity.ok(loans);
	}

//	@GetMapping("/{id}")
//	public ResponseEntity<LoanResponseDto> getLoanById(@PathVariable Long id) {
//		LoanEntity Loan = LoanService.getLoanById(id);
//		return ResponseEntity.ok(LoanResponseDto.from(Loan));
//	}
//
@PostMapping("/")
public ResponseEntity<LoanEntity> saveLoan(@RequestBody CreateLoanDto dto) {
    dto.setDeliveryDate(LocalDateTime.now());
	LoanEntity LoanNew = LoanService.saveLoan(dto);
	return ResponseEntity.ok(LoanNew);
}
//
//	@PutMapping("/")
//	public ResponseEntity<LoanResponseDto> updateLoan(@RequestBody UpdateLoanDto Loan){
//		System.out.println("\n id: " + Loan.getLoanId() + "\n");
//		System.out.println("\n name: " + Loan.getName() + "\n");
//		System.out.println("\n category id: " + Loan.getCategoryId() + "\n");
//		System.out.println("\n reposition value: " + Loan.getRepositionValue() + "\n");
//		LoanEntity LoanUpdated = LoanService.updateLoan(Loan);
//		return ResponseEntity.ok(LoanResponseDto.from(LoanUpdated));
//	}
//
//	@DeleteMapping("/{id}")
//	public ResponseEntity<Boolean> deleteLoanById(@PathVariable Long id) throws Exception {
//		LoanService.deleteLoan(id);
//		return ResponseEntity.noContent().build();
//	}
}