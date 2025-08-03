## Users
``` json
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String, // hashed
  status: "active" | "inactive" | "banned" // enum
}
```
---
## Profiles
``` json
{
  _id: ObjectId,
  user_id: ObjectId, // referencia a users
  firstname: String,
  lastname: String,
  address: String,
  phone_number: String,
  gender: "male" | "female" | "other" // enum
}
```
---
## Services
``` json
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number, // en USD o moneda usada
  time: Number, // duración estimada en minutos o días
  category: String, // Ej: "Delivery", "Cleaning", "Repair"
  image_url: String, // URL de la imagen del servicio
  created_at: Date,
  status: "active" | "paused" | "disabled" // enum
}
```
---
## Orders
``` json 
{
  _id: ObjectId,
  service_id: ObjectId,
  payment_id: ObjectId,
  user_id: ObjectId, // quién hace el pedido
  employee_id: ObjectId, // quién lo atiende
  creation_time: Date,
  delivery_time: Date, // estimado o real
  status: "pending" | "in_progress" | "delivered" | "cancelled", // enum
  step: String, // Ej: "Recibido", "En ruta", "Entregado"
  tracking_location: {
    lat: Number,
    lng: Number,
    updated_at: Date
  }
}
```
## Payments
``` json
{
  _id: ObjectId,
  transaction_number: String,
  amount: Number,
  user_id: ObjectId,
  method: "card" | "cash" | "paypal" | "crypto", // enum
  status: "pending" | "completed" | "failed" | "refunded", // enum
  paid_at: Date
}
```
## Employees
``` json
{
  _id: ObjectId,
  firstname: String,
  lastname: String,
  job: String,
  status: "active" | "inactive" | "terminated" // enum
}

```