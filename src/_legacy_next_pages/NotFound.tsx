import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <p className="text-2xl text-gray-700">Page Not Found</p>
          <p className="text-lg text-gray-600">Không tìm thấy trang</p>
        </div>
        <p className="text-gray-500 max-w-md">
          The page you're looking for doesn't exist or has been moved.
          <br />
          <span className="text-sm">Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</span>
        </p>
        <Link to="/">
          <Button size="lg" className="gap-2">
            <Home className="w-4 h-4" />
            Return to Home / Về Trang Chủ
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
