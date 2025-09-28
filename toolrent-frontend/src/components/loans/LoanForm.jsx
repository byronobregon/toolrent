import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react";
import loanService from "@/services/loan.service";
import clientService from "@/services/client.service";
import toolService from "@/services/tool.service";

const formSchema = z.object({
  clientRut: z.coerce.string({
    required_error: "Seleccione un Cliente",
    invalid_type_error: "Cliente inválido"
  }).min(1, "Se debe seleccionar un Cliente"),
  toolId: z.coerce.number({
    required_error: "Seleccione una Herramienta",
    invalid_type_error: "Herramienta inválida"
  }).int().positive("Se debe seleccionar una Herramienta"),
  returnDate: z
    .string({
      required_error: "Debe ingresar una fecha de devolución",
      invalid_type_error: "Fecha inválida",
    })
    .refine((value) => {
      if (!value) return false; // vacío
      // value viene como "YYYY-MM-DD" desde <input type="date">
      const [year, month, day] = value.split("-").map(Number);
      // Interpretar como fecha LOCAL sin hora para evitar desfases por UTC
      const selected = new Date(year, month - 1, day);
      selected.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, {
      message: "La fecha de devolución debe ser hoy o una fecha futura",
    }),
  dailyFee: z.coerce.number({
    required_error: "Debe agregar un valor",
    invalid_type_error: "Valor inválido"
  }).int().positive("El valor debe ser mayor a cero"),
  dailyPenalty: z.coerce.number({
    required_error: "Debe agregar un valor",
    invalid_type_error: "Valor inválido"
  }).int().positive("El valor debe ser mayor a cero")
})

const LoanForm = () => {
  const [formTitle, setFormTitle] = useState("");
  const [clients, setClients] = useState([]);
  const [tools, setTools] = useState([]);
  const navigate = useNavigate();

  const init = () => {
    clientService.getAvailable()
                 .then((response) => {
                   setClients(response.data)
                 }).catch((error) => {
                   console.log(error)
                 })
    toolService.getAvailable ()
               .then((response) => {
                 setTools(response.data)
               }).catch((error) => {
                 console.log(error)
               })
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientRut: "",
      toolId: "",
      returnDate: "",
      dailyFee: 0,
      dailyPenalty: 0,
    },
  })
 
  const onSubmit = (values) => {
    values['returnDate'] = values["returnDate"] + 'T00:00:00'
    loanService
      .create(values)
      .then((response) => {
        navigate("/loans/");
      })
      .catch((error) => {
        console.log(
          "Ha ocurrido un error al intentar crear el Préstamo.",
          error
        );
      });
  }

  useEffect(() => {
    init();
    setFormTitle("Nuevo Préstamo");
  }, []);

  return (
    <div className='w-full'>
      <Card>
        <CardHeader>
          <CardTitle className='flex justify-start'>{ formTitle }</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="clientRut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex justify-start'>Cliente</FormLabel>
                    <Select onValueChange={(v) => field.onChange(String(v))}
                            value={field.value != null ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={ client.clientRut } value={ String(client.clientRut) }>
                            { client.clientRut + ' - ' + client.name  }
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="toolId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex justify-start'>Herramienta</FormLabel>
                    <Select onValueChange={(v) => field.onChange(parseInt(v))}
                            value={field.value != null ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una Herramienta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tools.map((tool) => (
                          <SelectItem key={ tool.toolId } value={ String(tool.toolId) }>
                            { tool.name }
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-start">Fecha de Devolución</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dailyFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-start">Valor por Día</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ingrese un valor"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dailyPenalty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-start">Penalización por Día de Atraso</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ingrese un valor"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Guardar</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoanForm