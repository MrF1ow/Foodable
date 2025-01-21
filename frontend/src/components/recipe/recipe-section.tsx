export const RecipeSectionTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex items-start w-full text-3xl font-semibold text-foreground tracking-wide">
      <h2>{title}</h2>
    </div>
  );
};

export const RecipeSectionBody = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex flex-col w-full mt-4">{children}</div>;
};

export const RecipeSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col w-full mt-8">
      <RecipeSectionTitle title={title} />
      <RecipeSectionBody children={children} />
    </div>
  );
};
