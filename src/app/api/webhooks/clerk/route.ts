import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.text();
  const body = JSON.parse(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  // Handle user creation
  if (eventType === "user.created") {
    try {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;

      await prisma.user.create({
        data: {
          id: id,
          email: email_addresses[0]?.email_address || "",
          firstName: first_name || "",
          lastName: last_name || "",
          imageUrl: image_url || "",
        },
      });

      console.log("User created successfully in database");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  // Handle user updates
  if (eventType === "user.updated") {
    try {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;

      await prisma.user.update({
        where: { id: id },
        data: {
          email: email_addresses[0]?.email_address || "",
          firstName: first_name || "",
          lastName: last_name || "",
          imageUrl: image_url || "",
        },
      });

      console.log("User updated successfully in database");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  // Handle user deletion
  if (eventType === "user.deleted") {
    try {
      await prisma.user.delete({
        where: { id: id! },
      });

      console.log("User deleted successfully from database");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  return new Response("", { status: 200 });
}
