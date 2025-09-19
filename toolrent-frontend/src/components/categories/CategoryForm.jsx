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
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState, useEffect } from "react";
import categoryService from "@/services/category.service";

const formSchema = z.object({
  name: z.string()
})

const ProfileForm = () => {
  const [formTitle, setFormTitle] = useState("");
  const { category_id } = useParams();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })
 
  const onSubmit = (values) => {
    const category = { category_id: category_id, name: values.name };
    if (category_id) {
      categoryService
        .update(category)
        .then((response) => {
          navigate("/categories/");
        })
        .catch((error) => {
          console.log(
            "Ha ocurrido un error al intentar actualizar datos del empleado.",
            error
          );
        });
    } else {
       categoryService
         .create(values)
         .then((response) => {
           navigate("/categories/");
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
    if (category_id) {
      setFormTitle("Editar Categoría");
      categoryService
        .get(category_id)
        .then((category) => {
          form.reset({ name: category.data.name ?? "" })
        })
        .catch((error) => {
          console.log("Se ha producido un error.", error);
        });
    } else {
      setFormTitle("Nueva Categoría");
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
                    <FormMessage />
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

export default ProfileForm