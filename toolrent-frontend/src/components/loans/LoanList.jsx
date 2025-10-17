import { useEffect, useState } from "react";
import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from "@/components/ui/select"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import React from "react"
import loanService from "@/services/loan.service";
import loanReturnService from "@/services/loanReturn.service";

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [returnStatuses, setReturnStatuses] = useState({});
  const navigate = useNavigate();
  const [isSubmittingReturn, setIsSubmittingReturn] = useState({});

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

  const handleStatusChange = (loanId, status) => {
    setReturnStatuses((prev) => ({
      ...prev,
      [loanId]: status,
    }));
  };

  const handleReturnSubmit = async (event, loanId) => {
    event.preventDefault();
    const toolStatus = returnStatuses[loanId] ?? "Ok";
    const loanReturn = { loanId: loanId, toolStatus: toolStatus };
    setIsSubmittingReturn((prev) => ({
      ...prev,
      [loanId]: true,
    }));

    try {
      await loanReturnService.create(loanReturn);
      init();
    } catch (error) {
      console.log(
        "Ha ocurrido un error al intentar crear la Devolución.",
        error
      );
    } finally {
      setIsSubmittingReturn((prev) => ({
        ...prev,
        [loanId]: false,
      }));
    }
  };

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
                    {loan.clientRut}
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
                  {loan.status !== "Finalizado" && (
                    <TableCell className='text-right'>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Devolución</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <form onSubmit={(event) => handleReturnSubmit(event, loan.loanId)}
                            className="grid gap-6">
                            <DialogHeader>
                              <DialogTitle>Devolución</DialogTitle>
                              <DialogDescription>
                                {loan.toolName} a cuenta de {loan.clientName} - {loan.clientRut}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                              <div className="grid gap-3">
                                <Label htmlFor="name-1">Estado Herramienta</Label>
                                <Select
                                  value={returnStatuses[loan.loanId] ?? "Ok"}
                                  onValueChange={(value) => handleStatusChange(loan.loanId, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un estado" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectItem value="Ok">Ok</SelectItem>
                                      <SelectItem value="Dañada">Dañada</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                              </DialogClose>
                              <Button
                                type="submit"
                                disabled={Boolean(isSubmittingReturn[loan.loanId])}>
                                Registrar Devolución
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  )}
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
