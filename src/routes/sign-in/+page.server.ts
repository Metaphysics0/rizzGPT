import { auth } from "$lib/server/auth";
import type { Actions, RequestEvent } from "./$types";

export const actions: Actions = {
  signIn: async ({ request }: RequestEvent) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    const session = await auth.api.signInEmail({
      body: {
        email: email as string,
        password: password as string,
      },
    });

    return session;
  },
  signUp: async ({ request }: RequestEvent) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");
    const image = formData.get("image");

    const session = await auth.api.signUpEmail({
      body: {
        name: name as string,
        email: email as string,
        password: password as string,
        image: image as string,
        callbackURL: "/",
        rememberMe: false,
      },
    });

    return session;
  },
};
