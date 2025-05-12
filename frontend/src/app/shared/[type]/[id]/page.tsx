import SharedRedirect from "@/components/SharedRedirect";

export default async function Page(context: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await context.params;

  return <SharedRedirect type={type} id={id} />;
}
