package mingeso.toolrent.services;

import mingeso.toolrent.dtos.CreateLoanReturnDto;
// import mingeso.toolrent.dtos.UpdateLoanReturnDto;
import mingeso.toolrent.entities.LoanReturnEntity;
import mingeso.toolrent.entities.LoanEntity;
import mingeso.toolrent.entities.ToolEntity;
import mingeso.toolrent.entities.ClientEntity;
import mingeso.toolrent.entities.MovementEntity;
import mingeso.toolrent.entities.PenaltyEntity;
import mingeso.toolrent.repositories.LoanReturnRepository;
import mingeso.toolrent.repositories.LoanRepository;
import mingeso.toolrent.repositories.ToolRepository;
import mingeso.toolrent.repositories.ClientRepository;
import mingeso.toolrent.repositories.MovementRepository;
import mingeso.toolrent.repositories.PenaltyRepository;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class LoanReturnService {
    @Autowired
    LoanReturnRepository loanReturnRepository;

    @Autowired
    LoanRepository loanRepository;

    @Autowired
    ToolRepository toolRepository;

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    MovementRepository movementRepository;

    @Autowired
    PenaltyRepository penaltyRepository;

    public ArrayList<LoanReturnEntity> getLoanReturns(){
        return (ArrayList<LoanReturnEntity>) loanReturnRepository.findAll();
    }

    public LoanReturnEntity saveLoanReturn(CreateLoanReturnDto dto) {
        LoanEntity loan = loanRepository.findById(dto.getLoanId())
                                  .orElseThrow(
                                    () -> new IllegalArgumentException(
                                        "Tool not found: " + dto.getLoanId()
                                    )
                                  );

        LoanReturnEntity loanReturn = new LoanReturnEntity();
        loanReturn.setLoan(loan);
        loanReturn.setDate(dto.getDate());
        loanReturn.setToolStatus(dto.getToolStatus());

        updateLoanStatus(loan, dto.getToolStatus());

        LoanReturnEntity savedLoanReturn = loanReturnRepository.save(loanReturn);

        MovementEntity movement = new MovementEntity();
        movement.setLoanReturn(savedLoanReturn);
        movement.setLoan(loan);
        movement.setType("Devolución");
        movement.setAmount(0);
        movement.setTool(savedLoanReturn.getLoan().getTool());
        movementRepository.save(movement);

        registerPenaltyIfNeeded(loan, dto.getPenaltyCharge());

        return savedLoanReturn;
    }

    private void registerPenaltyIfNeeded(LoanEntity loan, Integer penaltyCharge) {
      if (penaltyCharge == null || penaltyCharge <= 0) {
        return;
      }

      PenaltyEntity penalty = new PenaltyEntity();
      penalty.setLoan(loan);
      penalty.setConcept("Atraso");
      penalty.setStatus("Pagado");
      penalty.setCharge(penaltyCharge);
      PenaltyEntity savedPenalty = penaltyRepository.save(penalty);

      MovementEntity penaltyMovement = new MovementEntity();
      penaltyMovement.setPenalty(savedPenalty);
      penaltyMovement.setLoan(loan);
      penaltyMovement.setTool(loan.getTool());
      penaltyMovement.setType("Multa");
      penaltyMovement.setAmount(penaltyCharge);
      movementRepository.save(penaltyMovement);
    }

    public void updateLoanStatus(LoanEntity loan, String toolStatus) {
      loan.setStatus("Finalizado");
      loanRepository.save(loan);
      System.out.println(toolStatus);

      ToolEntity tool = loan.getTool();
      if (toolStatus.equals("Dañada")) {
        tool.setStatus("En Reparación");
      } else {
        tool.setStatus("Disponible");
      }
      toolRepository.save(tool);
      decreaseClientLoans(loan.getClient());
    }

    public void decreaseClientLoans(ClientEntity client) {
      int loans = client.getActiveLoans();
      loans -= 1;
      client.setActiveLoans(loans);
      clientRepository.save(client);
    }
}
