package mingeso.toolrent.dtos;

import mingeso.toolrent.entities.ToolEntity;

public class ToolResponseDto {
  public Long toolId;
  public String name;
  public Long categoryId;
  public String categoryName;
  public String status;
  public String statusColor;
  public Integer repositionValue;

  public static ToolResponseDto from(ToolEntity t) {
    var dto = new ToolResponseDto();
    dto.toolId = t.getTool_id();
    dto.name = t.getName();
    dto.status = t.getStatus();
    dto.repositionValue = t.getReposition_value();
    if (t.getCategory() != null) {
      dto.categoryId = t.getCategory().getCategory_id();
      dto.categoryName = t.getCategory().getName();
    }
    dto.statusColor = dto.determinateStatusColor();
    return dto;
  }

  private String determinateStatusColor() {
    if (status.equals("Prestada")) {
      return "bg-green-300";
    }

    return "";
  }
}