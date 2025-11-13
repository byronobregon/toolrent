package mingeso.toolrent.services;

import mingeso.toolrent.dtos.CreateRepairDto;
import mingeso.toolrent.entities.MovementEntity;
import mingeso.toolrent.entities.PenaltyEntity;
import mingeso.toolrent.entities.RepairEntity;
import mingeso.toolrent.entities.LoanEntity;
import mingeso.toolrent.entities.ToolEntity;
import mingeso.toolrent.repositories.MovementRepository;
import mingeso.toolrent.repositories.PenaltyRepository;
import mingeso.toolrent.repositories.RepairRepository;
import mingeso.toolrent.repositories.LoanRepository;
import mingeso.toolrent.repositories.ToolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.data.domain.Sort;

import java.util.ArrayList;

@Service
public class RepairService {
    @Autowired
    RepairRepository repairRepository;

    @Autowired
    LoanRepository loanRepository;

    @Autowired
    ToolRepository toolRepository;

    @Autowired
    MovementRepository movementRepository;

    @Autowired
    PenaltyRepository penaltyRepository;

    public ArrayList<RepairEntity> getRepairs() {
        return (ArrayList<RepairEntity>) repairRepository.findAll();
    }

    public RepairEntity saveRepair(CreateRepairDto dto) {
        ToolEntity tool = toolRepository.findById(dto.getToolId()).orElseThrow(
                            () -> new IllegalStateException("No existe la herramienta")
                          );
        // todo: loan debe ser el último loan asociado a tool
        LoanEntity loan = loanRepository.findFirstByToolOrderByLoanIdDesc(tool);
        if (loan == null) {
            throw new IllegalStateException("La herramienta no tiene préstamos registrados");
        }

        boolean retireTool = Boolean.TRUE.equals(dto.getRetireTool());

        RepairEntity repair = new RepairEntity();
        repair.setLoan(loan);
        repair.setTool(tool);
        repair.setCharge(dto.getCharge());
        repair.setStatus("Pendiente");

        RepairEntity savedRepair = repairRepository.save(repair);
        if (retireTool) {
            tool.setStatus("Dada de baja");
        } else {
            tool.setStatus("Disponible");
        }
        toolRepository.save(tool);

        MovementEntity movement = new MovementEntity();
        movement.setRepair(savedRepair);
        movement.setLoan(loan);
        movement.setTool(tool);
        movement.setType("Reparación");
        movement.setAmount(savedRepair.getCharge());
        movementRepository.save(movement);

        PenaltyEntity penalty = new PenaltyEntity();
        penalty.setLoan(loan);
        penalty.setConcept("Reposición");
        penalty.setStatus("Pendiente");
        if (retireTool) {
            penalty.setCharge(tool.getReposition_value());
        } else {
            penalty.setCharge(savedRepair.getCharge());
        }
        penaltyRepository.save(penalty);

        return savedRepair;
    }
}
