import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MeaningOfLife() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/room/meaning-of-life-vip3", { replace: true });
  }, [navigate]);
  
  return null;
}
