package mingeso.toolrent.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mingeso.toolrent.dtos.ClientPenaltyReportDto;
import mingeso.toolrent.dtos.ToolLoanReportDto;
import mingeso.toolrent.entities.LoanEntity;
import mingeso.toolrent.repositories.LoanRepository;
import mingeso.toolrent.repositories.PenaltyRepository;

@Service
public class ReportsService {

    private final LoanRepository loanRepository;
    private final PenaltyRepository penaltyRepository;

    @Autowired
    public ReportsService(LoanRepository loanRepository, PenaltyRepository penaltyRepository) {
        this.loanRepository = loanRepository;
        this.penaltyRepository = penaltyRepository;
    }

    public List<LoanEntity> getActiveLoans() {
        return loanRepository.findByStatusNot("Finalizado");
    }

    public List<ClientPenaltyReportDto> getClientsWithPendingPenalties() {
        return penaltyRepository.findClientPenaltySummaryByStatus("Pendiente")
                .stream()
                .map(ClientPenaltyReportDto::from)
                .toList();
    }

    public List<ToolLoanReportDto> getMostLoanedTools() {
        return loanRepository.findToolLoanSummary()
                .stream()
                .map(ToolLoanReportDto::from)
                .toList();
    }
}
