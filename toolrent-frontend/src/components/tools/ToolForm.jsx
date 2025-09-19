import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useParams, useNavigate } from "react-router-dom";
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
import toolService from "@/services/tool.service";
import categoryService from "@/services/category.service";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  categoryId: z.coerce.number({
    required_error: "Seleccione una categoría",
    invalid_type_error: "Categoría inválida"
  }).int().positive("Categoría inválida"),
  repositionValue: z.coerce.number({
    required_error: "El valor de reposición es requerido",
    invalid_type_error: "Debe ser un número"
  }).nonnegative("El precio no puede ser negativo")
})

const ToolForm = () => {
  const [formTitle, setFormTitle] = useState("");
  const [categories, setCategories] = useState([]);
  const { tool_id } = useParams();
  const navigate = useNavigate();

  const init = () => {
    categoryService.getAll()
                   .then((response) => {
                    setCategories(response.data)
                   }).catch((error) => {
                    console.log(error)
                   })
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      repositionValue: 0
    },
  })
 
  const onSubmit = (values) => {
    if (tool_id) {
      const tool = { toolId: tool_id, name: values.name, categoryId: values.categoryId, repositionValue: values.repositionValue };
      toolService
        .update(tool)
        .then((response) => {
          navigate("/tools/");
        })
        .catch((error) => {
          console.log(
            "Ha ocurrido un error al intentar actualizar datos del empleado.",
            error
          );
        });
    } else {
       toolService
         .create(values)
         .then((response) => {
           navigate("/tools/");
         })
         .catch((error) => {
           console.log(
             "Ha ocurrido un error al intentar crear nuevo empleado.",
             error
           );
         });
    }
  }

  useEffect(() => {
    init();
    if (tool_id) {
      setFormTitle("Editar Herramienta");
      toolService
        .get(tool_id)
        .then((tool) => {
          form.reset({
            name: tool.data.name ?? "",
            categoryId: tool.data.categoryId ?? null,
            repositionValue: tool.data.repositionValue ?? 0
          })
        })
        .catch((error) => {
          console.log("Se ha producido un error.", error);
        });
    } else {
      setFormTitle("Nueva Herramienta");
    }
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex justify-start'>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese un nombre" { ...field }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex justify-start'>Categoría</FormLabel>
                    <Select onValueChange={(v) => field.onChange(parseInt(v))}
                            value={field.value != null ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={ category.category_id } value={ String(category.category_id) }>
                            { category.name }
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="repositionValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-start">Valor de Reposición</FormLabel>
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

export default ToolForm