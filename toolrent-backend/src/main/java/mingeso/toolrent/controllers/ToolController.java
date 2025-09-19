package mingeso.toolrent.controllers;

import mingeso.toolrent.entities.ToolEntity;
import mingeso.toolrent.services.ToolService;
import mingeso.toolrent.dtos.CreateToolDto;
import mingeso.toolrent.dtos.ToolResponseDto;
import mingeso.toolrent.dtos.UpdateToolDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tools")
@CrossOrigin("*")
public class ToolController {
    @Autowired
	ToolService ToolService;

    @GetMapping("/")
	public ResponseEntity<List<ToolResponseDto>> listTools() {
    	var tools = ToolService.getTools().stream().map(ToolResponseDto::from).toList();
		return ResponseEntity.ok(tools);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ToolResponseDto> getToolById(@PathVariable Long id) {
		ToolEntity Tool = ToolService.getToolById(id);
		return ResponseEntity.ok(ToolResponseDto.from(Tool));
	}

	@PostMapping("/")
	public ResponseEntity<ToolEntity> saveTool(@RequestBody CreateToolDto dto) {
		ToolEntity ToolNew = ToolService.saveTool(dto);
		return ResponseEntity.ok(ToolNew);
	}

	@PutMapping("/")
	public ResponseEntity<ToolResponseDto> updateTool(@RequestBody UpdateToolDto Tool){
		System.out.println("\n id: " + Tool.getToolId() + "\n");
		System.out.println("\n name: " + Tool.getName() + "\n");
		System.out.println("\n category id: " + Tool.getCategoryId() + "\n");
		System.out.println("\n reposition value: " + Tool.getRepositionValue() + "\n");
		ToolEntity ToolUpdated = ToolService.updateTool(Tool);
		return ResponseEntity.ok(ToolResponseDto.from(ToolUpdated));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Boolean> deleteToolById(@PathVariable Long id) throws Exception {
		var isDeleted = ToolService.deleteTool(id);
		return ResponseEntity.noContent().build();
	}
}