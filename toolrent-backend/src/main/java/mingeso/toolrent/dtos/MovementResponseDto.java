package mingeso.toolrent.dtos;

import java.time.LocalDateTime;

import mingeso.toolrent.entities.LoanEntity;
import mingeso.toolrent.entities.LoanReturnEntity;
import mingeso.toolrent.entities.MovementEntity;
import mingeso.toolrent.entities.PenaltyEntity;
import mingeso.toolrent.entities.RepairEntity;
import mingeso.toolrent.entities.ToolEntity;

public class MovementResponseDto {
  public Long movementId;
  public String type;
  public Integer amount;
  public ToolSummary tool;
  public LoanSummary loan;
  public LoanReturnSummary loanReturn;
  public RepairSummary repair;
  public PenaltySummary penalty;

  public static MovementResponseDto from(MovementEntity movement) {
    var dto = new MovementResponseDto();
    dto.movementId = movement.getMovementId();
    dto.type = movement.getType();
    dto.amount = movement.getAmount();
    dto.tool = buildToolSummary(movement.getTool());
    dto.loan = buildLoanSummary(movement.getLoan());
    dto.loanReturn = buildLoanReturnSummary(movement.getLoanReturn());
    dto.repair = buildRepairSummary(movement.getRepair());
    dto.penalty = buildPenaltySummary(movement.getPenalty());
    return dto;
  }

  private static ToolSummary buildToolSummary(ToolEntity tool) {
    if (tool == null) {
      return null;
    }
    var summary = new ToolSummary();
    summary.toolId = tool.getTool_id();
    summary.name = tool.getName();
    summary.status = tool.getStatus();
    return summary;
  }

  private static LoanSummary buildLoanSummary(LoanEntity loan) {
    if (loan == null) {
      return null;
    }
    var summary = new LoanSummary();
    summary.loanId = loan.getLoanId();
    summary.status = loan.getStatus();
    summary.deliveryDate = loan.getDeliveryDate();
    summary.returnDate = loan.getReturnDate();
    return summary;
  }

  private static LoanReturnSummary buildLoanReturnSummary(LoanReturnEntity loanReturn) {
    if (loanReturn == null) {
      return null;
    }
    var summary = new LoanReturnSummary();
    summary.loanReturnId = loanReturn.getLoanReturnId();
    summary.date = loanReturn.getDate();
    summary.toolStatus = loanReturn.getToolStatus();
    return summary;
  }

  private static RepairSummary buildRepairSummary(RepairEntity repair) {
    if (repair == null) {
      return null;
    }
    var summary = new RepairSummary();
    summary.repairId = repair.getRepairId();
    summary.status = repair.getStatus();
    summary.charge = repair.getCharge();
    return summary;
  }

  private static PenaltySummary buildPenaltySummary(PenaltyEntity penalty) {
    if (penalty == null) {
      return null;
    }
    var summary = new PenaltySummary();
    summary.penaltyId = penalty.getPenaltyId();
    summary.concept = penalty.getConcept();
    summary.status = penalty.getStatus();
    summary.charge = penalty.getCharge();
    return summary;
  }

  public static class ToolSummary {
    public Long toolId;
    public String name;
    public String status;
  }

  public static class LoanSummary {
    public Long loanId;
    public String status;
    public LocalDateTime deliveryDate;
    public LocalDateTime returnDate;
  }

  public static class LoanReturnSummary {
    public Long loanReturnId;
    public LocalDateTime date;
    public String toolStatus;
  }

  public static class RepairSummary {
    public Long repairId;
    public String status;
    public Integer charge;
  }

  public static class PenaltySummary {
    public Long penaltyId;
    public String concept;
    public String status;
    public Integer charge;
  }
}
