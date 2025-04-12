
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NotFoundView = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 text-center">
      <h2 className="text-2xl font-semibold text-gray-900">Student not found</h2>
      <p className="mt-2 text-gray-600">The profile you are looking for does not exist or has been removed.</p>
      <Link to="/students">
        <Button variant="outline" className="mt-4">
          Back to Students
        </Button>
      </Link>
    </div>
  );
};
