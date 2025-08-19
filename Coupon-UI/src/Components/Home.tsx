import { useContext, useEffect } from "react";
import UserContext from "../Utility/UserContext";
import useCouponsData from "../Utility/useCouponsData";
import { columns } from "@/Components/Coupons-Datatable/CouponsColumns";
import { CouponsDataTable } from "@/Components/Coupons-Datatable/CouponsDatatable";
import { toast } from "sonner";
import useLoader from "@/Utility/useLoader";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Home = () => {
  const { user } = useContext(UserContext);
  const { data, error, isLoading } = useCouponsData();
  const progress = useLoader(isLoading);

  useEffect(() => {
    if (error) {
      toast.error("Error", {
        duration: 5000,
        dismissible: true,
        description: error.message,
      });
    }
  }, [error]);

  return isLoading ?
    (<div className="flex items-center justify-center w-screen h-screen bg-white">
      <div className="w-64">
        <Progress value={progress} className="w-full" />
      </div>
    </div>) :
    (
      <div className="pt-30 px-4 max-w-7xl mx-auto">
        <Card >
          <CardHeader>
            <Label className="text-3xl font-bold mb-1">
              Coupons
            </Label>
            <Label className="text-xs text-muted-foreground">
              Here are your latest coupons and offers.
            </Label>
          </CardHeader>
          <CardContent>
            <CouponsDataTable data={data} columns={columns} />
          </CardContent>
        </Card>
      </div>
    );
};

export default Home;
