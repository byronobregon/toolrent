import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import movementService from "@/services/movement.service";

const Kardex = () => {
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMovements = async () => {
      try {
        const response = await movementService.getAll();
        setMovements(response.data);
      } catch (error) {
        console.log("Ha ocurrido un error al intentar cargar el Kardex.", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovements();
  }, []);

  const renderToolInfo = (movement) => {
    if (!movement.tool) {
      return "-";
    }
    return `${movement.tool.name ?? "-"} (#${movement.tool.toolId ?? "-"})`;
  };

  const renderLoanInfo = (movement) => {
    if (!movement.loan) {
      return "-";
    }
    return `${movement.loan.clientRut ?? "-"} (${movement.loan.status ?? "-"})`;
  };

  const renderLoanReturnInfo = (movement) => {
    if (!movement.loanReturn) {
      return "-";
    }
    return `${movement.loanReturn.date ?? "-"} (${movement.loanReturn.toolStatus ?? "-"})`;
  };

  const renderRepairInfo = (movement) => {
    if (!movement.repair) {
      return "-";
    }
    return `${movement.repair.status ?? "-"}`;
  };

  const renderPenaltyInfo = (movement) => {
    if (!movement.penalty) {
      return "-";
    }
    return `${movement.penalty.concept ?? "-"} (${movement.penalty.charge ?? 0})`;
  };

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Herramienta</TableHead>
                <TableHead>Préstamo</TableHead>
                <TableHead>Devolución</TableHead>
                <TableHead>Reparación</TableHead>
                <TableHead>Multa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Cargando movimientos...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && movements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No hay movimientos registrados.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                movements.map((movement) => (
                  <TableRow key={movement.movementId}>
                    <TableCell>{movement.type}</TableCell>
                    <TableCell>{movement.amount}</TableCell>
                    <TableCell>{renderToolInfo(movement)}</TableCell>
                    <TableCell>{renderLoanInfo(movement)}</TableCell>
                    <TableCell>{renderLoanReturnInfo(movement)}</TableCell>
                    <TableCell>{renderRepairInfo(movement)}</TableCell>
                    <TableCell>{renderPenaltyInfo(movement)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Kardex;
