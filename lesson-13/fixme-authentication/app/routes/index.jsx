import { redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { get } from "mongoose";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "~/sessions.server";

export async function loader({ request }) {
  const session = await requireUserSession(request);
  if (!session.get("userId")) {
    return redirect("/login");
  }
  const db = await connectDb();

  // TODO: Get the `userId` from the session and filter the books to only return
  // those belonging to the current user
  const books = await db.models.Book.find({ userId: session.get("userId") });
  return books;
}

export default function Index() {
  const books = useLoaderData();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Remix + Mongoose</h1>
      <h2 className="text-lg font-bold mb-3">
        Here are a few of my favorite books:
      </h2>
      <ul className="ml-5 list-disc">
        {books.map((book) => {
          return (
            <li key={book._id}>
              <Link
                to={`/books/${book._id}`}
                className="text-blue-600 hover:underline"
              >
                {book.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
