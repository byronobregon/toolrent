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
import categoryService from "@/services/category.service";

const Kardex = () => {
  const [movements, setMovements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoadingMovements, setIsLoadingMovements] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const loadMovements = async () => {
      try {
        const response = await movementService.getAll();
        setMovements(response.data ?? []);
      } catch (error) {
        console.log("Ha ocurrido un error al intentar cargar el Kardex.", error);
      } finally {
        setIsLoadingMovements(false);
      }
    };

    loadMovements();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryService.getAll();
        setCategories(response.data ?? []);
      } catch (error) {
        console.log("Ha ocurrido un error al cargar las categorías.", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
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
    <div className="w-full flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Stock disponible</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingCategories && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    Cargando stock por categoría...
                  </TableCell>
                </TableRow>
              )}
              {!isLoadingCategories && categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No hay categorías registradas.
                  </TableCell>
                </TableRow>
              )}
              {!isLoadingCategories &&
                categories.map((category) => (
                  <TableRow key={category.category_id}>
                    <TableCell className='text-left'>{category.name}</TableCell>
                    <TableCell className='text-left'>{category.availableTools ?? 0}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
              {isLoadingMovements && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Cargando movimientos...
                  </TableCell>
                </TableRow>
              )}
              {!isLoadingMovements && movements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No hay movimientos registrados.
                  </TableCell>
                </TableRow>
              )}
              {!isLoadingMovements &&
                movements.map((movement) => (
                  <TableRow key={movement.movementId}>
                    <TableCell className='text-left'>{movement.type}</TableCell>
                    <TableCell className='text-left'>{movement.amount}</TableCell>
                    <TableCell className='text-left'>{renderToolInfo(movement)}</TableCell>
                    <TableCell className='text-left'>{renderLoanInfo(movement)}</TableCell>
                    <TableCell className='text-left'>{renderLoanReturnInfo(movement)}</TableCell>
                    <TableCell className='text-left'>{renderRepairInfo(movement)}</TableCell>
                    <TableCell className='text-left'>{renderPenaltyInfo(movement)}</TableCell>
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
