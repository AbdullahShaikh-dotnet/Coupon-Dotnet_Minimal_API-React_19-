import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import useLoader from "@/Utility/useLoader";
import { useCouponsDataByID } from "../Utility/useCouponsData";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useParams } from "react-router";

const CouponFields = () => {
  const { couponID, operation } = useParams();

  const [defaultValues, setDefaultValues] = useState({});

  const { data, error, isLoading } = useCouponsDataByID(couponID);

  const setValues = (e) => {
    const { id, value } = e.target;
    setDefaultValues((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    if (data) {
      setDefaultValues({
        couponName: data.name || "",
        couponCode: data.couponCode || "",
        isActive: data.isActive ?? false,
        percentage: data.percentage ?? 0,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : new Date(),
      });
    }

    if (error) {
      toast.error("Error", {
        duration: 5000,
        dismissible: true,
        description: error.message,
      });
    }
  }, [data, error]);
  const progress = useLoader(isLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-white">
        <div className="w-64">
          <Progress value={progress} className="w-full" />
        </div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-white">
        <p className="text-red-500">No data found for the given coupon ID.</p>
      </div>
    );
  }
  return (
    <div className="pt-30 px-4 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-4">
            {operation.charAt(0).toUpperCase() + operation.slice(1)} Coupon
            <Label className="text-sm text-muted-foreground">
              Here you can {operation} a coupon
            </Label>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="couponName">Coupon Name</Label>
              <Input
                value={defaultValues.couponName}
                onChange={setValues}
                type="text"
                id="couponName"
                placeholder="Coupon Name"
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="couponCode">Coupon Code</Label>
              <Input
                value={defaultValues.couponCode}
                onChange={setValues}
                type="text"
                id="couponCode"
                placeholder="Coupon Code"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={defaultValues.isActive}
                onCheckedChange={(val) =>
                  setDefaultValues((prev) => ({ ...prev, isActive: val }))
                }
              />
              <Label htmlFor="isActive">Is-Active?</Label>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="percentage">Percentage</Label>
              <Input
                type="number"
                id="percentage"
                placeholder="Percentage"
                value={defaultValues.percentage}
                onChange={setValues}
              />
              <Slider
                onValueChange={(e) => {
                  setDefaultValues((prev) => ({
                    ...prev,
                    percentage: e[0],
                  }));
                }}
                max={100}
                step={1}
                value={[defaultValues.percentage]}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CouponFields;
