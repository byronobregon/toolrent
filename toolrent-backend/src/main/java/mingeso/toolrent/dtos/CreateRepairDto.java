package mingeso.toolrent.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateRepairDto {
    private Integer charge;
    private Long toolId;
    private Boolean retireTool;
}
