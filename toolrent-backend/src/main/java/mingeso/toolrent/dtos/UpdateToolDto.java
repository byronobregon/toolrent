package mingeso.toolrent.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateToolDto {
    private Long toolId;
    private String name;
    private Long categoryId;
    private Integer repositionValue;
    private String status;
}