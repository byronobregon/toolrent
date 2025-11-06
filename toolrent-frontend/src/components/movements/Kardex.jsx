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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import movementService from "@/services/movement.service";
import categoryService from "@/services/category.service";

const Kardex = () => {
  const [movements, setMovements] = useState([]);
  const [allMovements, setAllMovements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isLoadingMovements, setIsLoadingMovements] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const loadMovements = async () => {
      try {
        const response = await movementService.getAll();
        const data = response.data ?? [];
        setMovements(data);
        setAllMovements(data);
      } catch (error) {
        console.log("Ha ocurrido un error al intentar cargar el Kardex.", error);
        setMovements([]);
        setAllMovements([]);
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

  const handleClearFilter = () => {
    setSelectedCategoryId(null);
    setMovements(allMovements);
  };

  const handleCategoryClick = async (category) => {
    if (!category) {
      return;
    }

    const categoryId = category.category_id;

    if (selectedCategoryId === categoryId) {
      handleClearFilter();
      return;
    }

    setSelectedCategoryId(categoryId);
    setIsLoadingMovements(true);

    try {
      const response = await movementService.getByCategory(categoryId);
      setMovements(response.data ?? []);
    } catch (error) {
      console.log(
        "Ha ocurrido un error al filtrar los movimientos por categoría.",
        error
      );
      setMovements([]);
    } finally {
      setIsLoadingMovements(false);
    }
  };

  const handleCategoryKeyDown = (event, category) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCategoryClick(category);
    }
  };

  const selectedCategory = categories.find(
    (category) => category.category_id === selectedCategoryId
  );

  return (
    <div className="w-full flex flex-col gap-6">
      <Card>
        <CardHeader className="space-y-1 sm:flex sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle>Categorías</CardTitle>
            <CardDescription>
              Haz clic en una categoría para filtrar los movimientos.
            </CardDescription>
          </div>
          {selectedCategoryId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilter}
              className="self-start sm:self-auto"
            >
              Ver todas
            </Button>
          )}
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
                categories.map((category) => {
                  const isSelected = selectedCategoryId === category.category_id;
                  return (
                    <TableRow
                      key={category.category_id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleCategoryClick(category)}
                      onKeyDown={(event) =>
                        handleCategoryKeyDown(event, category)
                      }
                      className={cn(
                        "cursor-pointer hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isSelected && "bg-muted"
                      )}
                    >
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>{category.availableTools ?? 0}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Movimientos</CardTitle>
          <CardDescription>
            {selectedCategory
              ? `Mostrando movimientos para la categoría "${selectedCategory.name}".`
              : "Mostrando todos los movimientos registrados."}
          </CardDescription>
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
                    {selectedCategory
                      ? "No hay movimientos asociados a esta categoría."
                      : "No hay movimientos registrados."}
                  </TableCell>
                </TableRow>
              )}
              {!isLoadingMovements &&
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

export default Kardex;
