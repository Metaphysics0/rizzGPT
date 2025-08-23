import { authClient } from "$lib/auth-client";
import { fail, type Actions } from "@sveltejs/kit";

// const schema = z.object({
//   name: z.string().default("Hello world!"),
//   email: z.email(),
// });

// export const load = async () => {
//   // const form = await superValidate(zod4(schema));
//   return { form };
// };

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    if (!email || !password) {
      return fail(400, {
        formData,
        message: "Email and password are required",
      });
    }

    try {
      // Use the form data for signup instead of hardcoded values
      const { error } = await authClient.signIn.email({
        email: email as string,
        password: password as string,
        callbackURL: "/",
        rememberMe: true,
      });

      console.log(formData);

      if (error) {
        return fail(400, {
          formData,
          message: error.message || "Signin failed",
        });
      }

      // If signin is successful, you might want to redirect or set a success message
      return {
        formData,
        message: "Signin successful",
        redirect: "/",
      };
    } catch (error) {
      // Handle any unexpected errors
      console.log(error);

      return fail(500, {
        formData,
        message: "An unexpected error occurred",
      });
    }
  },
};
