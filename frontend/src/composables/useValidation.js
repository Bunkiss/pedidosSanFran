import { useField, useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import * as z from "zod"

// ✅ Esquemas de validación
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export const registerSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefono: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .max(20, "El teléfono no puede tener más de 20 caracteres")
    .regex(/^[0-9+\-\s()]+$/, "El teléfono solo puede contener números, +, -, espacios y paréntesis")
    .optional()
    .or(z.literal("")),
  contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  rol: z.enum(["cliente", "vendor", "driver", "admin"]),
})

export const productSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  precio: z.number().positive("El precio debe ser mayor a 0"),
  categoria: z.string().min(2, "La categoría es requerida"),
  disponible: z.boolean(),
})

export const vehicleSchema = z.object({
  tipo: z.string().min(2, "El tipo es requerido"),
  marca: z.string().min(2, "La marca es requerida"),
  modelo: z.string().min(2, "El modelo es requerido"),
  placa: z.string().min(5, "La placa debe tener al menos 5 caracteres"),
  año: z.number().min(1900).max(new Date().getFullYear() + 1),
})

// ✅ Composable para validación dinámica (con soporte para useField)
export function useValidation(schema) {
  const validationSchema = toTypedSchema(schema)

  // 🟢 Inicializamos el formulario con el esquema
  const { handleSubmit, errors, values, resetForm } = useForm({
    validationSchema,
  })

  // 🟢 Exponemos también el método useField() directamente
  //     (ya conectado al contexto actual del form)
  const field = (name) => useField(name)

  return {
    handleSubmit,
    errors,
    values,
    resetForm,
    useField: field, // 👈 ahora devuelve useField vinculado al form
  }
}
