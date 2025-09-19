package mingeso.toolrent.controllers;

import mingeso.toolrent.entities.CategoryEntity;
import mingeso.toolrent.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@CrossOrigin("*")
public class CategoryController {
    @Autowired
	CategoryService categoryService;

    @GetMapping("/")
	public ResponseEntity<List<CategoryEntity>> listCategorys() {
    	List<CategoryEntity> categories = categoryService.getCategories();
		return ResponseEntity.ok(categories);
	}

	@GetMapping("/{id}")
	public ResponseEntity<CategoryEntity> getCategoryById(@PathVariable Long id) {
		CategoryEntity category = categoryService.getCategoryById(id);
		return ResponseEntity.ok(category);
	}

	@PostMapping("/")
	public ResponseEntity<CategoryEntity> saveCategory(@RequestBody CategoryEntity category) {
		CategoryEntity categoryNew = categoryService.saveCategory(category);
		return ResponseEntity.ok(categoryNew);
	}

	@PutMapping("/")
	public ResponseEntity<CategoryEntity> updateCategory(@RequestBody CategoryEntity category){
		CategoryEntity categoryUpdated = categoryService.updateCategory(category);
		return ResponseEntity.ok(categoryUpdated);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Boolean> deleteCategoryById(@PathVariable Long id) throws Exception {
		var isDeleted = categoryService.deleteCategory(id);
		return ResponseEntity.noContent().build();
	}
}