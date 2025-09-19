package mingeso.toolrent.services;

import mingeso.toolrent.entities.CategoryEntity;
import mingeso.toolrent.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CategoryService {
    @Autowired
    CategoryRepository categoryRepository;

    public ArrayList<CategoryEntity> getCategories(){
        return (ArrayList<CategoryEntity>) categoryRepository.findAll();
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
}