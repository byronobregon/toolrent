import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import React from "react"
import categoryService from "@/services/category.service";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  const init = () => {
    categoryService
      .getAll()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(
          error
        );
      });
  };

  useEffect(() => {
    init();
  }, []);


  const handleDelete = (category_id) => {
    const confirmDelete = window.confirm(
      "¿Esta seguro que desea borrar esta categoría?"
    );
    if (confirmDelete) {
      categoryService
        .remove(category_id)
        .then((response) => {
          init();
        })
        .catch((error) => {
          console.log(
            "Se ha producido un error",
            error
          );
        });
    }
  };

  return (
    <div className='w-full'>
      <Card>
        <CardHeader>
          <CardTitle className='flex justify-start'>Categorías</CardTitle>
        </CardHeader>
        <CardFooter className="flex justify-end space-x-2">
          <Button asChild>
            <Link to="/categories/new">
              Agregar Categoría
            </Link>
          </Button>
        </CardFooter>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.category_id}>
                  <TableCell className='text-left'>
                    <Link to={ "/categories/edit/" +  category.category_id }>
                      {category.name}
                    </Link>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button variant='destructive'
                      onClick={() => handleDelete(category.category_id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default CategoryList
