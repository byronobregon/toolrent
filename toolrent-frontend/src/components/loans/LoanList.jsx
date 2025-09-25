import { useEffect, useState } from "react";
import { Plus } from "lucide-react"
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
import loanService from "@/services/loan.service";

const LoanList = () => {
  const [loans, setLoans] = useState([]);

  const init = () => {
    loanService
      .getAll()
      .then((response) => {
        setLoans(response.data);
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


  return (
    <div className='w-full'>
      <Card>
        <CardHeader>
          <CardTitle className='flex justify-start'>Préstamos</CardTitle>
        </CardHeader>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant='outline' size='sm' asChild>
            <Link to="/loans/new">
              <Plus /> Nuevo Préstamo
            </Link>
          </Button>
        </CardFooter>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rut Cliente</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Herramienta</TableHead>
                <TableHead>Fecha de Entrega</TableHead>
                <TableHead>Fecha de Devolución</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.loanId}>
                  <TableCell className='text-left'>
                    <Link to={ "/loans/edit/" +  loan.loanId }>
                      {loan.clientRut}
                    </Link>
                  </TableCell>
                  <TableCell className='text-left'>
                      {loan.clientName}
                  </TableCell>
                  <TableCell className='text-left'>
                      {loan.toolName}
                  </TableCell>
                  <TableCell className='text-left'>
                      {loan.deliveryDate}
                  </TableCell>
                  <TableCell className='text-left'>
                      {loan.returnDate}
                  </TableCell>
                  <TableCell className='text-left'>
                      {loan.status}
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

export default LoanList