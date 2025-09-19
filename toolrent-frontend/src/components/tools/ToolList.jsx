import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import React from "react"
import toolService from "@/services/tool.service";

const ToolsList = () => {
  const [tools, setTools] = useState([]);

  const init = () => {
    toolService
      .getAll()
      .then((response) => {
        setTools(response.data);
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


  const handleDelete = (tool_id) => {
    const confirmDelete = window.confirm(
      "¿Esta seguro que desea borrar esta categoría?"
    );
    if (confirmDelete) {
      toolService
        .remove(tool_id)
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
          <CardTitle className='flex justify-start'>Herramientas</CardTitle>
        </CardHeader>
        <CardFooter className="flex justify-end space-x-2">
          <Button asChild>
            <Link to="/tools/new">
              Agregar Herramienta
            </Link>
          </Button>
        </CardFooter>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Valor de Reposición</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tools.map((tool) => (
                <TableRow key={tool.toolId}>
                  <TableCell className='text-left'>
                    <Link to={ "/tools/edit/" +  tool.toolId }>
                      {tool.name}
                    </Link>
                  </TableCell>
                  <TableCell className='text-left'>
                      {tool.categoryName}
                  </TableCell>
                  <TableCell className='text-left'>
                      {tool.status}
                  </TableCell>
                  <TableCell className='text-left'>
                      {tool.repositionValue}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button variant='destructive'
                      onClick={() => handleDelete(tool.toolId)}
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

export default ToolsList
