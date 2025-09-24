import { useEffect, useState } from "react";
import { Plus, Ellipsis } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import clientService from "@/services/client.service";

const ClientList = () => {
  const [clients, setClients] = useState([]);

  const init = () => {
    clientService
      .getAll()
      .then((response) => {
        setClients(response.data);
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


  const handleDelete = (clientRut) => {
    const confirmDelete = window.confirm(
      "¿Esta seguro que desea eliminar este cliente?"
    );
    if (confirmDelete) {
      clientService
        .remove(clientRut)
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
          <CardTitle className='flex justify-start'>Clientes</CardTitle>
        </CardHeader>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant='outline' size='sm' asChild>
            <Link to="/clients/new">
              <Plus /> Registrar Cliente 
            </Link>
          </Button>
        </CardFooter>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rut</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Préstamos Activos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.clientRut}>
                  <TableCell className='text-left'>
                    <Link to={ "/clients/edit/" +  client.clientRut }>
                      {client.clientRut}
                    </Link>
                  </TableCell>
                  <TableCell className='text-left'>
                      {client.name}
                  </TableCell>
                  <TableCell className='text-left'>
                      {client.activeLoans}
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost'>
                          <Ellipsis />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Link to={ "/clients/edit/" +  client.clientRut }>
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='text-red-600 hover:text-red-700 focus:text-red-700' onClick={() => handleDelete(client.clientRut)}>
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default ClientList
