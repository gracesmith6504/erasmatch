
type NameDisplayProps = {
  name: string | null;
  email: string | null;
};

export const NameDisplay = ({ name, email }: NameDisplayProps) => {
  return (
    <div className="text-center py-2">
      <h2 className="text-lg font-semibold text-gray-800">
        {name || "Your full name"}
      </h2>
      
      <div className="text-sm text-gray-500">
        {email}
      </div>
    </div>
  );
};
