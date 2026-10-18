"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function toggleMessageReadStatusAction(id: string, currentLu: boolean): Promise<void> {
  const session = await getSession();
  if (!session) return;

  await prisma.contactMessage.update({
    where: { id },
    data: { lu: !currentLu },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
}

export async function deleteMessageAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) return;

  await prisma.contactMessage.delete({
    where: { id },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
}
