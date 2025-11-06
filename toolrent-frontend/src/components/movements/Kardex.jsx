import { useCallback, useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import movementService from "@/services/movement.service";
import categoryService from "@/services/category.service";

const Kardex = () => {
  const [movements, setMovements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });
  const [isLoadingMovements, setIsLoadingMovements] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const fetchMovements = useCallback(
    async (overrides = {}) => {
      const {
        categoryId = selectedCategoryId,
        startDate = filters.startDate,
        endDate = filters.endDate,
      } = overrides;

      setIsLoadingMovements(true);

      const params = {};
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }
      if (categoryId) {
        params.categoryId = categoryId;
      }

      try {
        const response = await movementService.getAll(params);
        const data = response.data ?? [];
        setMovements(data);
      } catch (error) {
        console.log(
          "Ha ocurrido un error al intentar cargar el Kardex.",
          error
        );
        setMovements([]);
      } finally {
        setIsLoadingMovements(false);
      }
    },
    [filters.endDate, filters.startDate, selectedCategoryId]
  );

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

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

  const handleFilterChange = (field) => (event) => {
    const value = event.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    if (
      filters.startDate &&
      filters.endDate &&
      filters.startDate > filters.endDate
    ) {
      return;
    }
    fetchMovements();
  };

  const handleResetFilters = () => {
    setSelectedCategoryId(null);
    setFilters({ startDate: "", endDate: "" });
    fetchMovements({ categoryId: null, startDate: "", endDate: "" });
  };

  const hasActiveFilters =
    Boolean(selectedCategoryId) ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate);

  const selectedCategory = categories.find(
    (category) => category.category_id === selectedCategoryId
  );

  const movementDescription = (() => {
    const base = selectedCategory
      ? `Mostrando movimientos para la categoría "${selectedCategory.name}"`
      : "Mostrando todos los movimientos registrados";

    if (!filters.startDate && !filters.endDate) {
      return `${base}.`;
    }

    let suffix = " filtrados";
    if (filters.startDate && filters.endDate) {
      suffix += ` entre ${filters.startDate} y ${filters.endDate}`;
    } else if (filters.startDate) {
      suffix += ` desde ${filters.startDate}`;
    } else if (filters.endDate) {
      suffix += ` hasta ${filters.endDate}`;
    }
    return `${base}${suffix}.`;
  })();
  const handleCategoryClick = (category) => {
    if (!category) {
      return;
    }

    const categoryId = category.category_id;
    const isSameCategory = selectedCategoryId === categoryId;
    const newCategoryId = isSameCategory ? null : categoryId;

    setSelectedCategoryId(newCategoryId);
    fetchMovements({ categoryId: newCategoryId });
  };

  const handleClearCategoryFilter = () => {
    if (!selectedCategoryId) {
      return;
    }
    setSelectedCategoryId(null);
    fetchMovements({ categoryId: null });
  };

  const handleCategoryKeyDown = (event, category) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCategoryClick(category);
    }
  };

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
              onClick={handleClearCategoryFilter}
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
                      <TableCell className="font-medium text-left">
                        {category.name}
                      </TableCell>
                      <TableCell className='text-left'>{category.availableTools ?? 0}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-1">
            <CardTitle>Movimientos</CardTitle>
            <CardDescription>{movementDescription}</CardDescription>
          </div>
          <form
            onSubmit={handleApplyFilters}
            className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-col gap-1">
                <Label htmlFor="startDate">Desde</Label>
                <Input
                  type="date"
                  id="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange("startDate")}
                  max={filters.endDate || undefined}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="endDate">Hasta</Label>
                <Input
                  type="date"
                  id="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange("endDate")}
                  min={filters.startDate || undefined}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                type="submit"
                disabled={
                  isLoadingMovements ||
                  (filters.startDate &&
                    filters.endDate &&
                    filters.startDate > filters.endDate)
                }
              >
                Aplicar filtros
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleResetFilters}
                disabled={!hasActiveFilters}
              >
                Limpiar filtros
              </Button>
            </div>
          </form>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
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
                    <TableCell className='text-left'>
                      {renderMovementDate(movement)}
                    </TableCell>
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

const renderMovementDate = (movement) => {
  if (!movement.date) {
    return "-";
  }
  const parsedDate = new Date(movement.date);
  if (Number.isNaN(parsedDate.getTime())) {
    return movement.date;
  }
  return parsedDate.toLocaleString();
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
