package mingeso.toolrent.dtos;

import mingeso.toolrent.entities.RepairEntity;

public class RepairResponseDto {
  public Long repairId;
  public Long loanId;
  public Integer charge;
  public String status;

  public static RepairResponseDto from(RepairEntity repair) {
    var dto = new RepairResponseDto();
    dto.repairId = repair.getRepairId();
    if (repair.getLoan() != null) {
      dto.loanId = repair.getLoan().getLoanId();
    }
    dto.charge = repair.getCharge();
    dto.status = repair.getStatus();
    return dto;
  }
}
