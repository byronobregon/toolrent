package mingeso.toolrent.dtos;

import mingeso.toolrent.repositories.LoanRepository.ToolLoanSummaryProjection;

public class ToolLoanReportDto {
  public String toolName;
  public Long totalLoans;

  public static ToolLoanReportDto from(ToolLoanSummaryProjection projection) {
    var dto = new ToolLoanReportDto();
    dto.toolName = projection.getToolName();
    dto.totalLoans = projection.getLoanCount();
    return dto;
  }
}
