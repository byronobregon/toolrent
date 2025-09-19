package mingeso.toolrent.services;

import mingeso.toolrent.dtos.CreateToolDto;
import mingeso.toolrent.dtos.UpdateToolDto;
import mingeso.toolrent.entities.CategoryEntity;
import mingeso.toolrent.entities.ToolEntity;
import mingeso.toolrent.repositories.ToolRepository;
import mingeso.toolrent.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class ToolService {
    @Autowired
    ToolRepository toolRepository;

    @Autowired
    CategoryRepository categoryRepository;

    public ArrayList<ToolEntity> getTools(){
        return (ArrayList<ToolEntity>) toolRepository.findAll();
    }

    public ToolEntity saveTool(CreateToolDto dto) {
        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
                                                    .orElseThrow(() -> new IllegalArgumentException("Category not found: " + dto.getCategoryId()));

        ToolEntity tool = new ToolEntity();
        tool.setName(dto.getName());
        tool.setCategory(category);
        tool.setReposition_value(dto.getRepositionValue());
        tool.setStatus("Disponible");
        return toolRepository.save(tool);
    }

    public ToolEntity getToolById(Long tool_id){
        return toolRepository.findById(tool_id).get();
    }

    public ToolEntity updateTool(UpdateToolDto dto) {
        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
                                                    .orElseThrow(() -> new IllegalArgumentException("Category not found: " + dto.getCategoryId()));
        ToolEntity tool = toolRepository.findById(dto.getToolId())
                                        .orElseThrow(() -> new IllegalArgumentException("Tool not found: " + dto.getToolId()));
        ToolEntity new_tool = new ToolEntity();

        new_tool.setTool_id(dto.getToolId());
        new_tool.setName(dto.getName());
        new_tool.setCategory(category);
        new_tool.setReposition_value(dto.getRepositionValue());
        if(dto.getStatus() == null) {
            new_tool.setStatus(tool.getStatus());
        } else {
            new_tool.setStatus(dto.getStatus());
        }

        return toolRepository.save(new_tool);
    }

    public boolean deleteTool(Long tool_id) throws Exception {
        try{
            toolRepository.deleteById(tool_id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }

    }
}