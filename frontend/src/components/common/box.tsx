interface BoxProps {
  keyValue: string;
  onClick: () => void;
  children: React.ReactNode;
}

export const Box = ({ keyValue, onClick, children }: BoxProps) => {
  return (
    <div
      key={keyValue}
      className="w-full sm:w-40 md:w-40 aspect-square rounded-lg relative shadow-lg overflow-hidden cursor-pointer z-10"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
