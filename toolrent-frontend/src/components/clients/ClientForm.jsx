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
import clientService from "@/services/client.service";

const formSchema = z.object({
  name: z.string(),
  clientRut: z.string()
})

const ProfileForm = () => {
  const [formTitle, setFormTitle] = useState("");
  const { clientRut } = useParams();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      clientRut: ""
    },
  })
 
  const onSubmit = (client) => {
    if (clientRut) {
      clientService
        .update(client)
        .then((response) => {
          navigate("/clients/");
        })
        .catch((error) => {
          console.log(
            "Ha ocurrido un error al intentar actualizar datos del empleado.",
            error
          );
        });
    } else {
       clientService
         .create(client)
         .then((response) => {
           navigate("/clients/");
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
    if (clientRut) {
      setFormTitle("Editar Cliente");
      clientService
        .get(clientRut)
        .then((client) => {
          form.reset({
            name: client.data.name ?? "",
            clientRut: client.data.clientRut ?? ""
          })
        })
        .catch((error) => {
          console.log("Se ha producido un error.", error);
        });
    } else {
      setFormTitle("Nuevo Cliente");
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
                name="clientRut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex justify-start'>Rut</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese un Rut Ej: 99999999-9" { ...field }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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