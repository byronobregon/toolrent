package mingeso.toolrent.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mingeso.toolrent.dtos.ClientPenaltyReportDto;
import mingeso.toolrent.dtos.LoanResponseDto;
import mingeso.toolrent.dtos.ToolLoanReportDto;
import mingeso.toolrent.services.ReportsService;

@RestController
@RequestMapping("/api/v1/reports")
@CrossOrigin("*")
public class ReportsController {

    private final ReportsService reportsService;

    @Autowired
    public ReportsController(ReportsService reportsService) {
        this.reportsService = reportsService;
    }

    @GetMapping("/active_loans")
    public ResponseEntity<List<LoanResponseDto>> getActiveLoans() {
        var loans = reportsService.getActiveLoans()
                .stream()
                .map(LoanResponseDto::from)
                .toList();
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/clients_with_penalties")
    public ResponseEntity<List<ClientPenaltyReportDto>> getClientsWithPenalties() {
        return ResponseEntity.ok(reportsService.getClientsWithPendingPenalties());
    }

    @GetMapping("/tools_most_loaned")
    public ResponseEntity<List<ToolLoanReportDto>> getMostLoanedTools() {
        return ResponseEntity.ok(reportsService.getMostLoanedTools());
    }
}
