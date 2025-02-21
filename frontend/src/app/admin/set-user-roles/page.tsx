import { clerkClient } from "@clerk/nextjs/server";
import { removeRole, setRole } from "./_actions";

import { MainLayout } from "@/layouts/admin/main";
import { ContentLayout } from "@/layouts/admin/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function AdminDashboard(params: {
  searchParams: Promise<{ search?: string }>;
}) {
  const query = (await params.searchParams).search;

  const client = await clerkClient();
  const users = query ? (await client.users.getUserList({ query })).data : [];

  const Header = () => {
    return (
      <form className="mb-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="search">Search for users</label>
          <div className="flex gap-2">
            <Input
              id="search"
              name="search"
              type="text"
              className="flex-grow"
            />
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </form>
    );
  };

  const Content = () => {
    return (
      <div>
        {users.map((user) => (
          <div key={user.id} className="flex min-h-screen flex-col">
            <div className="space-y-4 rounded-md bg-white p-4 shadow-md">
              <div className="text-lg font-semibold text-gray-800">
                {user.firstName} {user.lastName}
              </div>

              <div className="text-sm text-gray-600">
                {
                  user.emailAddresses.find(
                    (email) => email.id === user.primaryEmailAddressId
                  )?.emailAddress
                }
              </div>

              <div className="text-sm font-medium text-blue-600">
                Role: {user.publicMetadata.role as string}
              </div>
              <div className="mt-2 flex space-x-4">
                <form action={setRole} className="mt-2">
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="admin" name="role" />
                  <Button type="submit">Make Admin</Button>
                </form>

                <form action={setRole} className="mt-2">
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="user" name="role" />
                  <Button type="submit">Make Registered User</Button>
                </form>

                <form action={setRole} className="mt-2">
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="guest" name="role" />
                  <Button type="submit">Make Guest</Button>
                </form>

                <form action={removeRole} className="mt-2">
                  <input type="hidden" value={user.id} name="id" />
                  <Button
                    type="submit"
                    className="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                  >
                    Remove Role
                  </Button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <MainLayout headerComponent={<Header />}>
      <ContentLayout mainContent={<Content />} />
    </MainLayout>
  );
}
