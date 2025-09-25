package mingeso.toolrent.services;

import mingeso.toolrent.dtos.CreateLoanDto;
// import mingeso.toolrent.dtos.UpdateLoanDto;
import mingeso.toolrent.entities.LoanEntity;
import mingeso.toolrent.entities.ClientEntity;
import mingeso.toolrent.entities.ToolEntity;
import mingeso.toolrent.repositories.LoanRepository;
import mingeso.toolrent.repositories.ClientRepository;
import mingeso.toolrent.repositories.ToolRepository;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class LoanService {
    @Autowired
    LoanRepository loanRepository;

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    ToolRepository toolRepository;

    public ArrayList<LoanEntity> getLoans(){
        return (ArrayList<LoanEntity>) loanRepository.findAll();
    }

    public LoanEntity saveLoan(CreateLoanDto dto) {
        ClientEntity client = clientRepository.findByClientRut(dto.getClientRut())
                                  .orElseThrow(
                                    () -> new IllegalArgumentException(
                                        "Client not found: " + dto.getClientRut()
                                    )
                                  );
        ToolEntity tool = toolRepository.findById(dto.getToolId())
                                  .orElseThrow(
                                    () -> new IllegalArgumentException(
                                        "Tool not found: " + dto.getToolId()
                                    )
                                  );

        LoanEntity loan = new LoanEntity();
        loan.setClient(client);
        loan.setTool(tool);
        loan.setDeliveryDate(dto.getDeliveryDate());
        loan.setReturnDate(dto.getReturnDate());
        loan.setDailyFee(dto.getDailyFee());
        loan.setDailyPenalty(dto.getDailyPenalty());
        loan.setStatus("Activo");
        return loanRepository.save(loan);
    }

    // public LoanEntity getLoanById(Long loan_id){
    //     return loanRepository.findById(loan_id).get();
    // }

    // public LoanEntity updateLoan(UpdateLoanDto dto) {
    //     CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
    //                                                 .orElseThrow(() -> new IllegalArgumentException("Category not found: " + dto.getCategoryId()));
    //     LoanEntity loan = loanRepository.findById(dto.getLoanId())
    //                                     .orElseThrow(() -> new IllegalArgumentException("Loan not found: " + dto.getLoanId()));
    //     LoanEntity new_loan = new LoanEntity();

    //     new_loan.setLoan_id(dto.getLoanId());
    //     new_loan.setName(dto.getName());
    //     new_loan.setCategory(category);
    //     new_loan.setReposition_value(dto.getRepositionValue());
    //     if(dto.getStatus() == null) {
    //         new_loan.setStatus(loan.getStatus());
    //     } else {
    //         new_loan.setStatus(dto.getStatus());
    //     }

    //     return loanRepository.save(new_loan);
    // }

    // public boolean deleteLoan(Long loan_id) throws Exception {
    //     try{
    //         loanRepository.deleteById(loan_id);
    //         return true;
    //     } catch (Exception e) {
    //         throw new Exception(e.getMessage());
    //     }

    // }
}