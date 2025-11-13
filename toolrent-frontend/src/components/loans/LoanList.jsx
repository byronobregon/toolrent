import { useEffect, useState } from "react";
import { Plus } from "lucide-react"
import { differenceInCalendarDays, startOfDay } from "date-fns";
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

const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0);

const calculateLoanTotals = (loan) => {
  if (!loan?.deliveryDate || !loan?.returnDate || loan?.dailyFee == null) {
    return null;
  }

  const deliveryDate = new Date(loan.deliveryDate);
  const returnDate = new Date(loan.returnDate);

  if (
    Number.isNaN(deliveryDate.getTime()) ||
    Number.isNaN(returnDate.getTime())
  ) {
    return null;
  }

  const rawDays =
    differenceInCalendarDays(startOfDay(returnDate), startOfDay(deliveryDate)) + 1;
  if (rawDays <= 0) {
    return null;
  }

  const days = Math.max(1, rawDays);
  const dailyFee = Number(loan.dailyFee);
  const dailyPenalty = Number(loan.dailyPenalty) || 0;

  if (Number.isNaN(dailyFee)) {
    return null;
  }

  const baseAmount = dailyFee * days;
  const today = startOfDay(new Date());
  const plannedReturn = startOfDay(returnDate);
  const delayDays = differenceInCalendarDays(today, plannedReturn);
  const penaltyDays = delayDays > 0 ? delayDays : 0;
  const penaltyAmount = dailyPenalty * penaltyDays;

  return {
    amount: baseAmount,
    days,
    dailyFee,
    penaltyDays,
    penaltyAmount,
    dailyPenalty,
    total: baseAmount + penaltyAmount,
  };
};

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [returnStatuses, setReturnStatuses] = useState({});
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
    const loanData = loans.find((item) => item.loanId === loanId);
    const penaltyCharge =
      (loanData ? calculateLoanTotals(loanData)?.penaltyAmount : 0) || 0;
    const loanReturn = {
      loanId: loanId,
      toolStatus: toolStatus,
      penaltyCharge,
    };
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
              {loans.map((loan) => {
                const totalInfo = calculateLoanTotals(loan);
                return (
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
                            {totalInfo && (
                              <div className="space-y-3 rounded-md border p-3 text-left">
                                <div>
                                  <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">Préstamo</p>
                                  <p className="text-lg font-semibold">
                                    {formatCurrency(totalInfo.amount)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Valor diario {formatCurrency(totalInfo.dailyFee)} × {totalInfo.days} día{totalInfo.days === 1 ? "" : "s"}
                                  </p>
                                </div>
                                {totalInfo.penaltyDays > 0 && (
                                  <div>
                                    <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">Multa por atraso</p>
                                    <p className="text-lg font-semibold">
                                      {formatCurrency(totalInfo.penaltyAmount)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Penalización diaria {formatCurrency(totalInfo.dailyPenalty)} × {totalInfo.penaltyDays} día{totalInfo.penaltyDays === 1 ? "" : "s"}
                                    </p>
                                  </div>
                                )}
                                <div className="border-t pt-2">
                                  <p className="text-sm font-medium text-muted-foreground">Total a pagar</p>
                                  <p className="text-2xl font-semibold">
                                    {formatCurrency(totalInfo.total)}
                                  </p>
                                </div>
                              </div>
                            )}
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
              );
            })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoanList
