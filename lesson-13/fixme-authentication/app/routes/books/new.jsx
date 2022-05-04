import { Form, useActionData } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "~/sessions.server";

export async function loader({ request }) {
  const session = await requireUserSession(request);
  if (!session.get("userId")) {
    return redirect("/login");
  }
  return null;
}
// TODO: Implement a loader that verifies that the user is logged in, otherwise redirect them to the login page

export async function action({ request }) {
  const session = await requireUserSession(request);
  const userId = session.get("userId");
  if (!session.get("userId") === undefined) {
    return redirect("/login");
  }

  // TODO: Verify that the user is logged in, otherwise redirect them to the login page
  const form = await request.formData();
  const db = await connectDb();
  try {
    // TODO: In addition to the title, also set a `userId` pulled from the session
    const newBook = await db.models.Book.create({
      title: form.get("title"),
      userId: userId,
    });
    return redirect(`/books/${newBook._id}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export default function CreateBook() {
  const actionData = useActionData();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create book</h1>
      <Form method="post">
        <label htmlFor="title" className="block font-semibold mb-1">
          Title:
        </label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Title"
          defaultValue={actionData?.values.title}
          className={[
            "block my-3 border rounded px-2 py-1 w-full lg:w-1/2 bg-white border-zinc-300",
            actionData?.errors.title && "border-2 border-red-500",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        {actionData?.errors.title && (
          <p className="text-red-500 mt-1 mb-0">
            {actionData.errors.title.message}
          </p>
        )}
        <button
          type="submit"
          className="p-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded"
        >
          Save
        </button>
      </Form>
    </div>
  );
}
