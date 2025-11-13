package mingeso.toolrent.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mingeso.toolrent.dtos.PendingPenaltySummaryDto;
import mingeso.toolrent.services.PenaltyService;

@RestController
@RequestMapping("/api/v1/penalties")
@CrossOrigin("*")
public class PenaltyController {

    private final PenaltyService penaltyService;

    public PenaltyController(PenaltyService penaltyService) {
        this.penaltyService = penaltyService;
    }

    @GetMapping("/clients/{clientRut}/pending-summary")
    public ResponseEntity<PendingPenaltySummaryDto> getPendingSummary(@PathVariable String clientRut) {
        PendingPenaltySummaryDto summary = penaltyService.getPendingSummary(clientRut);
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/clients/{clientRut}/pay")
    public ResponseEntity<PendingPenaltySummaryDto> payClientPenalties(@PathVariable String clientRut) {
        PendingPenaltySummaryDto summary = penaltyService.payPendingPenalties(clientRut);
        return ResponseEntity.ok(summary);
    }
}
