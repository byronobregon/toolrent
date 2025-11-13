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
import penaltyService from "@/services/penalty.service";
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

const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0);

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [penaltySummaries, setPenaltySummaries] = useState({});
  const [penaltyLoading, setPenaltyLoading] = useState({});
  const [penaltyErrors, setPenaltyErrors] = useState({});
  const [payingPenalty, setPayingPenalty] = useState({});

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

  const fetchPendingPenalties = async (clientRut) => {
    setPenaltyErrors((prev) => ({ ...prev, [clientRut]: null }));
    setPenaltyLoading((prev) => ({ ...prev, [clientRut]: true }));
    try {
      const response = await penaltyService.getPendingSummary(clientRut);
      setPenaltySummaries((prev) => ({ ...prev, [clientRut]: response.data }));
    } catch (error) {
      setPenaltyErrors((prev) => ({
        ...prev,
        [clientRut]: "No se pudieron obtener las multas pendientes.",
      }));
      console.log("Error al cargar multas pendientes", error);
    } finally {
      setPenaltyLoading((prev) => ({ ...prev, [clientRut]: false }));
    }
  };

  const handlePayPenalties = async (clientRut) => {
    setPenaltyErrors((prev) => ({ ...prev, [clientRut]: null }));
    setPayingPenalty((prev) => ({ ...prev, [clientRut]: true }));
    try {
      const response = await penaltyService.payPenalties(clientRut);
      setPenaltySummaries((prev) => ({ ...prev, [clientRut]: response.data }));
      init();
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        "No se pudieron pagar las multas pendientes.";
      setPenaltyErrors((prev) => ({ ...prev, [clientRut]: apiMessage }));
      console.log(apiMessage, error);
    } finally {
      setPayingPenalty((prev) => ({ ...prev, [clientRut]: false }));
    }
  };


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
                <TableHead className="text-right">Multas</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
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
                    <Dialog
                      onOpenChange={(isOpen) => {
                        if (isOpen) {
                          fetchPendingPenalties(client.clientRut);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant='outline' size='sm'>
                          Pagar Multas
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[420px]">
                        <DialogHeader>
                          <DialogTitle>Pagar Multas</DialogTitle>
                          <DialogDescription>
                            {client.name} - {client.clientRut}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 text-left">
                          {penaltyErrors[client.clientRut] && (
                            <p className="text-sm text-red-600">
                              {penaltyErrors[client.clientRut]}
                            </p>
                          )}
                          {penaltyLoading[client.clientRut] ? (
                            <p className="text-sm text-muted-foreground">
                              Cargando multas pendientes...
                            </p>
                          ) : (
                            <>
                              <div className="space-y-1 rounded-md border p-3">
                                <p className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
                                  Total pendiente
                                </p>
                                <p className="text-2xl font-semibold">
                                  {formatCurrency(
                                    penaltySummaries[client.clientRut]?.pendingAmount ?? 0
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(penaltySummaries[client.clientRut]?.pendingCount ?? 0)} multa(s) pendientes
                                </p>
                              </div>
                              {(penaltySummaries[client.clientRut]?.pendingCount ?? 0) === 0 && (
                                <p className="text-sm text-muted-foreground">
                                  El cliente no registra multas pendientes.
                                </p>
                              )}
                            </>
                          )}
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cerrar</Button>
                          </DialogClose>
                          <Button
                            type="button"
                            onClick={() => handlePayPenalties(client.clientRut)}
                            disabled={
                              penaltyLoading[client.clientRut] ||
                              payingPenalty[client.clientRut] ||
                              (penaltySummaries[client.clientRut]?.pendingCount ?? 0) === 0
                            }
                          >
                            {payingPenalty[client.clientRut] ? "Pagando..." : "Pagar"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
