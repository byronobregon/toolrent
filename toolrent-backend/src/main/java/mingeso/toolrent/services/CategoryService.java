package mingeso.toolrent.services;

import mingeso.toolrent.dtos.CategoryResponseDto;
import mingeso.toolrent.entities.CategoryEntity;
import mingeso.toolrent.repositories.CategoryRepository;
import mingeso.toolrent.repositories.ToolRepository;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ToolRepository toolRepository;

    public List<CategoryResponseDto> getCategories(){
        return categoryRepository
            .findAll()
            .stream()
            .map(this::toCategoryResponseDto)
            .collect(Collectors.toList());
    }

    public CategoryEntity saveCategory(CategoryEntity category){
        return categoryRepository.save(category);
    }

    public CategoryEntity getCategoryById(Long category_id){
        return categoryRepository.findById(category_id).get();
    }

    public CategoryEntity updateCategory(CategoryEntity category) {
        return categoryRepository.save(category);
    }

    public boolean deleteCategory(Long category_id) throws Exception {
        try{
            categoryRepository.deleteById(category_id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }

    }

    private CategoryResponseDto toCategoryResponseDto(CategoryEntity category) {
        long availableTools = toolRepository.countByCategoryAndStatus(category, "Disponible");
        return CategoryResponseDto.from(category, availableTools);
    }
}
