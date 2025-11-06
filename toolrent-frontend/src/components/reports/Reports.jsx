import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import reportsService from "@/services/reports.service";

const TABS = [
  { id: "activeLoans", label: "Préstamos Activos" },
  { id: "clientsWithPenalties", label: "Clientes con Multas" },
  { id: "mostLoanedTools", label: "Herramientas Más Prestadas" },
];

const formatDateTime = (value) => {
  if (!value) return "—";

  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString("es-CL");
  } catch (error) {
    return value;
  }
};

const EmptyState = ({ message }) => (
  <div className="py-10 text-center text-sm text-muted-foreground">
    {message}
  </div>
);

const Reports = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [activeLoans, setActiveLoans] = useState([]);
  const [clientsWithPenalties, setClientsWithPenalties] = useState([]);
  const [mostLoanedTools, setMostLoanedTools] = useState([]);
  const [loading, setLoading] = useState({
    activeLoans: false,
    clientsWithPenalties: false,
    mostLoanedTools: false,
  });
  const [errors, setErrors] = useState({
    activeLoans: null,
    clientsWithPenalties: null,
    mostLoanedTools: null,
  });

  useEffect(() => {
    fetchActiveLoans();
    fetchClientsWithPenalties();
    fetchMostLoanedTools();
  }, []);

  const fetchActiveLoans = async () => {
    setLoading((prev) => ({ ...prev, activeLoans: true }));
    setErrors((prev) => ({ ...prev, activeLoans: null }));
    try {
      const response = await reportsService.getActiveLoans();
      setActiveLoans(response.data ?? []);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        activeLoans: "No fue posible cargar los préstamos activos.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, activeLoans: false }));
    }
  };

  const fetchClientsWithPenalties = async () => {
    setLoading((prev) => ({ ...prev, clientsWithPenalties: true }));
    setErrors((prev) => ({ ...prev, clientsWithPenalties: null }));
    try {
      const response = await reportsService.getClientsWithPenalties();
      setClientsWithPenalties(response.data ?? []);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        clientsWithPenalties:
          "No fue posible cargar los clientes con multas pendientes.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, clientsWithPenalties: false }));
    }
  };

  const fetchMostLoanedTools = async () => {
    setLoading((prev) => ({ ...prev, mostLoanedTools: true }));
    setErrors((prev) => ({ ...prev, mostLoanedTools: null }));
    try {
      const response = await reportsService.getMostLoanedTools();
      setMostLoanedTools(response.data ?? []);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        mostLoanedTools:
          "No fue posible cargar las herramientas más prestadas.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, mostLoanedTools: false }));
    }
  };

  const renderActiveLoans = () => {
    if (loading.activeLoans) {
      return <EmptyState message="Cargando préstamos activos..." />;
    }
    if (errors.activeLoans) {
      return <EmptyState message={errors.activeLoans} />;
    }
    if (!activeLoans.length) {
      return <EmptyState message="No hay préstamos activos registrados." />;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Herramienta</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Fecha Entrega</TableHead>
            <TableHead>Fecha Devolución</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Tarifa Diaria</TableHead>
            <TableHead>Multa Diaria</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeLoans.map((loan) => (
            <TableRow key={loan.loanId}>
              <TableCell>{loan.loanId}</TableCell>
              <TableCell>{loan.toolName ?? "—"}</TableCell>
              <TableCell>{loan.clientName ?? loan.clientRut ?? "—"}</TableCell>
              <TableCell>{formatDateTime(loan.deliveryDate)}</TableCell>
              <TableCell>{formatDateTime(loan.returnDate)}</TableCell>
              <TableCell>{loan.status ?? "—"}</TableCell>
              <TableCell>
                {loan.dailyFee != null ? `$${loan.dailyFee}` : "—"}
              </TableCell>
              <TableCell>
                {loan.dailyPenalty != null ? `$${loan.dailyPenalty}` : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderClientsWithPenalties = () => {
    if (loading.clientsWithPenalties) {
      return <EmptyState message="Cargando clientes con multas..." />;
    }
    if (errors.clientsWithPenalties) {
      return <EmptyState message={errors.clientsWithPenalties} />;
    }
    if (!clientsWithPenalties.length) {
      return <EmptyState message="No hay clientes con multas pendientes." />;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>RUT</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Multas Pendientes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientsWithPenalties.map((client) => (
            <TableRow key={client.clientRut}>
              <TableCell>{client.clientRut}</TableCell>
              <TableCell>{client.clientName ?? "—"}</TableCell>
              <TableCell>{client.pendingPenalties ?? 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderMostLoanedTools = () => {
    if (loading.mostLoanedTools) {
      return <EmptyState message="Cargando herramientas..." />;
    }
    if (errors.mostLoanedTools) {
      return <EmptyState message={errors.mostLoanedTools} />;
    }
    if (!mostLoanedTools.length) {
      return <EmptyState message="No hay datos de préstamos para mostrar." />;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Herramienta</TableHead>
            <TableHead>Total Préstamos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mostLoanedTools.map((tool) => (
            <TableRow key={tool.toolName}>
              <TableCell>{tool.toolName}</TableCell>
              <TableCell>{tool.totalLoans ?? 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "activeLoans":
        return renderActiveLoans();
      case "clientsWithPenalties":
        return renderClientsWithPenalties();
      case "mostLoanedTools":
        return renderMostLoanedTools();
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Reportes</CardTitle>
          <div className="mt-4 flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>{renderTabContent()}</CardContent>
      </Card>
    </div>
  );
};

export default Reports;
