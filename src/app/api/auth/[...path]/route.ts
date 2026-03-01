import { auth } from "@_lib/auth-server";

export const { GET, POST, PUT, DELETE, PATCH } = auth.handler();
