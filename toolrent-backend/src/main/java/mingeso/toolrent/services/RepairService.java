package mingeso.toolrent.services;

import mingeso.toolrent.dtos.CreateRepairDto;
import mingeso.toolrent.entities.RepairEntity;
import mingeso.toolrent.entities.LoanEntity;
import mingeso.toolrent.repositories.RepairRepository;
import mingeso.toolrent.repositories.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;

@Service
public class RepairService {
    @Autowired
    RepairRepository repairRepository;

    @Autowired
    LoanRepository loanRepository;

    public ArrayList<RepairEntity> getRepairs() {
        return (ArrayList<RepairEntity>) repairRepository.findAll();
    }

    public RepairEntity saveRepair(CreateRepairDto dto) {
        LoanEntity loan = loanRepository
                            .findAll(PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, "loanId")))
                            .stream()
                            .findFirst()
                            .orElseThrow(() -> new IllegalStateException("No existen préstamos"));

        RepairEntity repair = new RepairEntity();
        repair.setLoan(loan);
        repair.setCharge(dto.getCharge());
        repair.setStatus("Pendiente");

        return repairRepository.save(repair);
    }
}
