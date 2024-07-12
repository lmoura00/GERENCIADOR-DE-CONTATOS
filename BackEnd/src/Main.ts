import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/contact", async (request: Request, response: Response) => {
  const contact = await prisma.contact.findMany();
  return response.json(contact);
});

app.get("/contact/:id", async (request: Request, response: Response) => {
  const { id } = request.params;
  const contact = await prisma.contact.findUnique({
    where: {
      id: Number(id),
    },
  });
  return response.json(contact);
});

app.post("/contact", async (request, response) => {
  const { name, lastname, phone, adress, email } = request.body;
  const newContact = await prisma.contact.create({
    data: {
      name,
      lastname,
      phone,
      adress,
      email,
      favorite: false,
    },
  });
  return response.status(201).json(newContact);
});

app.get("/contact/:name", async (request: Request, response: Response) => {
  const { name } = request.params;

  try {
    const contact = await prisma.contact.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (!contact) {
      return response.status(404).json({ error: "Contact not found" });
    }

    return response.json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
});

//PUT PARA EDITAR
app.put("/contact/:id", async (request: Request, response: Response) => {
  const { id } = request.params;
  const { name, lastname, adress, email, phone, favorite } = request.body;
  const contact = await prisma.contact.update({
    data: {
      name,
      lastname,
      adress,
      email,
      phone,
      favorite,
    },
    where: {
      id: Number(id),
    },
  });
  return response.json(contact);
});
//PUT PARA FAVORITAR
app.put("/contact_edit/:id", async (request: Request, response: Response) => {
  const { id } = request.params;
  const { favorite } = request.body;
  const contact = await prisma.contact.update({
    data: {
      favorite: !favorite,
    },
    where: {
      id: Number(id),
    },
  });
  return response.json(contact);
});

app.delete("/contact/:id", async (request: Request, response: Response) => {
  const { id } = request.params;
  try {
    await prisma.contact.delete({
      where: {
        id: Number(id),
      },
    });
    response.send("Contact deleted");
  } catch (erro) {
    response.send(erro);
  }
});

app.listen(3333, () => console.log("SERVER RUNNING... 🚀"));
