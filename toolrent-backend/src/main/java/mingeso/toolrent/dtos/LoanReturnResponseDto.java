package mingeso.toolrent.dtos;

import mingeso.toolrent.entities.LoanReturnEntity;
import java.time.LocalDateTime;

public class LoanReturnResponseDto {
  public Long loanReturnId;
  public Long loanId;
  public LocalDateTime date;
  public String toolStatus;

  public static LoanReturnResponseDto from(LoanReturnEntity t) {
    var dto = new LoanReturnResponseDto();
    dto.loanId = t.getLoanReturnId();
    if (t.getLoan() != null) {
      dto.loanId = t.getLoan().getLoanId();
    }
    dto.date = t.getDate();
    dto.toolStatus = t.getToolStatus();
    return dto;
  }
}
