interface RecipeSectionTitleProps {
  title: string;
  additional?: React.ReactNode;
}

export const RecipeSectionTitle = ({
  title,
  additional,
}: RecipeSectionTitleProps) => {
  return additional ? (
    <div className="flex items-start w-[40%] text-3xl font-semibold text-foreground tracking-wide justify-between">
      <h2>{title}</h2>
      {additional}
    </div>
  ) : (
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
  additional,
}: {
  title: string;
  children: React.ReactNode;
  additional?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col w-full mt-8">
      {additional ? (
        <RecipeSectionTitle title={title} additional={additional} />
      ) : (
        <RecipeSectionTitle title={title} />
      )}
      <RecipeSectionBody children={children} />
    </div>
  );
};
