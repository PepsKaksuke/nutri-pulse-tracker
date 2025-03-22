
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: L'utilisateur a tenté d'accéder à une route inexistante:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-6 text-nutri-green-500">404</h1>
        <p className="text-xl text-gray-700 mb-8">Oups ! Cette page n'existe pas</p>
        <p className="text-gray-500 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-nutri-green-500 text-white rounded-lg hover:bg-nutri-green-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retourner à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
