package mingeso.toolrent.services;

import mingeso.toolrent.dtos.CreateLoanReturnDto;
// import mingeso.toolrent.dtos.UpdateLoanReturnDto;
import mingeso.toolrent.entities.LoanReturnEntity;
import mingeso.toolrent.entities.LoanEntity;
import mingeso.toolrent.entities.ToolEntity;
import mingeso.toolrent.entities.ClientEntity;
import mingeso.toolrent.repositories.LoanReturnRepository;
import mingeso.toolrent.repositories.LoanRepository;
import mingeso.toolrent.repositories.ToolRepository;
import mingeso.toolrent.repositories.ClientRepository;
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
        return loanReturnRepository.save(loanReturn);
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
