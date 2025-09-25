package mingeso.toolrent.dtos;

import mingeso.toolrent.entities.LoanEntity;
import java.time.LocalDateTime;

public class LoanResponseDto {
  public Long loanId;
  public String clientRut;
  public String clientName;
  public Long toolId;
  public String toolName;
  public LocalDateTime deliveryDate;
  public LocalDateTime returnDate;
  public String status;
  public Integer dailyFee;
  public Integer dailyPenalty;

  public static LoanResponseDto from(LoanEntity t) {
    var dto = new LoanResponseDto();
    dto.loanId = t.getLoanId();
    if (t.getClient() != null) {
      dto.clientRut = t.getClient().getClientRut();
      dto.clientName = t.getClient().getName();
    }
    if (t.getTool() != null) {
      dto.toolId = t.getTool().getTool_id();
      dto.toolName = t.getTool().getName();
    }
    dto.deliveryDate = t.getDeliveryDate();
    dto.returnDate = t.getReturnDate();
    dto.status = t.getStatus();
    dto.dailyFee = t.getDailyFee();
    dto.dailyPenalty = t.getDailyPenalty();
    return dto;
  }
}