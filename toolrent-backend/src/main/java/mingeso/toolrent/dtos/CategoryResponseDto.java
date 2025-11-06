package mingeso.toolrent.dtos;

import mingeso.toolrent.entities.CategoryEntity;

public class CategoryResponseDto {
  public Long category_id;
  public String name;
  public Long availableTools;

  public static CategoryResponseDto from(CategoryEntity category, long availableTools) {
    var dto = new CategoryResponseDto();
    dto.category_id = category.getCategory_id();
    dto.name = category.getName();
    dto.availableTools = availableTools;
    return dto;
  }
}
