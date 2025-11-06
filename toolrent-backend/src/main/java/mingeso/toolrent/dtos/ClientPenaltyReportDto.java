package mingeso.toolrent.dtos;

import mingeso.toolrent.repositories.PenaltyRepository.ClientPenaltyProjection;

public class ClientPenaltyReportDto {
  public String clientRut;
  public String clientName;
  public Long pendingPenalties;

  public static ClientPenaltyReportDto from(ClientPenaltyProjection projection) {
    var dto = new ClientPenaltyReportDto();
    dto.clientRut = projection.getClientRut();
    dto.clientName = projection.getClientName();
    dto.pendingPenalties = projection.getPendingCount();
    return dto;
  }
}
