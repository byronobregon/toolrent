import { useEffect, useState } from "react";
import { Plus, Ellipsis } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import React from "react"
import toolService from "@/services/tool.service";
import { Badge } from "@/components/ui/badge"
import repairService from "@/services/repair.service";

const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0);

const ToolsList = () => {
  const [tools, setTools] = useState([]);
  const [isSubmittingRepair, setIsSubmittingRepair] = useState({});
  const [repairCharges, setRepairCharges] = useState({});
  const [retireSelections, setRetireSelections] = useState({});

  const init = () => {
    toolService
      .getAll()
      .then((response) => {
        console.log(response.data)
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
      "¿Esta seguro que desea borrar esta herramienta?"
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

  const handleChargeChange = (toolId, charge) => {
    setRepairCharges((prev) => ({
      ...prev,
      [toolId]: charge,
    }));
  };

  const handleRetireChange = (toolId, checked) => {
    setRetireSelections((prev) => ({
      ...prev,
      [toolId]: checked,
    }));
    if (checked) {
      const tool = tools.find((item) => item.toolId === toolId);
      setRepairCharges((prev) => ({
        ...prev,
        [toolId]: tool?.repositionValue ?? "",
      }));
    }
  };

  const handleRepairSubmit = async (event, toolId) => {
    event.preventDefault();
    const tool = tools.find((item) => item.toolId === toolId);
    const shouldRetire = Boolean(retireSelections[toolId]);
    const repositionValue = Number(tool?.repositionValue ?? 0);
    const repairCharge = shouldRetire
      ? repositionValue
      : Number(repairCharges[toolId] ?? 0);
    const repair = { toolId: toolId, charge: repairCharge, retireTool: shouldRetire };
    setIsSubmittingRepair((prev) => ({
      ...prev,
      [toolId]: true,
    }));

    try {
      await repairService.create(repair);
      init();
    } catch (error) {
      console.log(
        "Ha ocurrido un error al intentar crear la Reparación.",
        error
      );
    } finally {
      setIsSubmittingRepair((prev) => ({
        ...prev,
        [toolId]: false,
      }));
    }
  };

  return (
    <div className='w-full'>
      <Card>
        <CardHeader>
          <CardTitle className='flex justify-start'>Herramientas</CardTitle>
        </CardHeader>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant='outline' size='sm' asChild>
            <Link to="/tools/new">
              <Plus /> Agregar Herramienta
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
                      <Badge variant="outline" className={ tool.statusColor }>
                        {tool.status}
                      </Badge>
                  </TableCell>
                  <TableCell className='text-left'>
                      {tool.repositionValue}
                  </TableCell>
                  {tool.status != "En Reparación" && (
                    <TableCell className='text-left'></TableCell>
                  )}
                  {tool.status == "En Reparación" && (
                    <TableCell className='text-right'>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Reparación</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <form onSubmit={(event) => handleRepairSubmit(event, tool.toolId)}
                            className="grid gap-6">
                            <DialogHeader>
                              <DialogTitle>Reparación</DialogTitle>
                              <DialogDescription>
                                {tool.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                              <div className="grid gap-3">
                                <Label htmlFor={`charge-${tool.toolId}`}>Cargo</Label>
                                <Input
                                  id={`charge-${tool.toolId}`}
                                  type="number"
                                  name="charge"
                                  min="0"
                                  placeholder="Ingresa el cargo de reparación"
                                  required
                                  disabled={Boolean(retireSelections[tool.toolId])}
                                  value={retireSelections[tool.toolId]
                                    ? tool.repositionValue ?? ""
                                    : repairCharges[tool.toolId] ?? ""}
                                  onChange={(event) => handleChargeChange(tool.toolId, event.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                  {retireSelections[tool.toolId]
                                    ? `Se cobrará el valor de reposición (${formatCurrency(tool.repositionValue ?? 0)}) al dar de baja la herramienta.`
                                    : "Ingresa el monto asociado a la reparación."}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  id={`retire-${tool.toolId}`}
                                  type="checkbox"
                                  checked={Boolean(retireSelections[tool.toolId])}
                                  onChange={(event) =>
                                    handleRetireChange(tool.toolId, event.target.checked)
                                  }
                                />
                                <Label htmlFor={`retire-${tool.toolId}`} className="cursor-pointer">
                                  Dar de baja la herramienta
                                </Label>
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancelar</Button>
                              </DialogClose>
                              <Button
                                type="submit"
                                disabled={Boolean(isSubmittingRepair[tool.toolId])}>
                                Registrar Reparación
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  )}
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost'>
                          <Ellipsis />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Link to={"/tools/edit/" + tool.toolId}>
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='text-red-600 hover:text-red-700 focus:text-red-700' onClick={() => handleDelete(tool.toolId)}>
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

export default ToolsList
