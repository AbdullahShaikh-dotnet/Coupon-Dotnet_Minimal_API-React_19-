import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Button } from "@/Components/ui/button"
import { Switch } from "@/Components/ui/switch"
import { Slider } from "@/Components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { Calendar } from "@/Components/ui/calendar"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import useLoader from "../Utility/useLoader"
import { useCouponsGetByID, useCouponPut } from "../Utility/useCoupons"
import { Progress } from "@/Components/ui/progress"
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card"
import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate, Link } from "react-router";

import UserContext from '../Utility/UserContext'

const CouponFields = () => {
    const { couponID, operation } = useParams();
    const [FieldError, setFieldError] = useState({});
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    // Determine if we're in edit mode
    const isEditMode = operation === "edit" && couponID;

    const [defaultValues, setDefaultValues] = useState({
        id: isEditMode ? couponID : 0,
        name: "",
        couponCode: "",
        isActive: false,
        percentage: 0,
        expireDate: "2025-09-01",
    })

    const validate = (values) => {
        const newErrors = {};

        if (!values.name.trim()) {
            newErrors.couponName = "Coupon name is required.";
        }
        if (!values.couponCode.trim()) {
            newErrors.couponCode = "Coupon code is required.";
        }
        if (values.percentage <= 0 || values.percentage > 100) {
            newErrors.percentage = "Percentage must be between 1 and 100.";
        }
        if (new Date(values.expireDate) <= new Date()) {
            newErrors.expireDate = "Expiry date must be in the future.";
        }

        return newErrors;
    };

    function formatDate(date) {
        return date.toISOString().split('T')[0]; // gives yyyy-MM-dd
    }

    // Only fetch data if we're in edit mode
    const { data, error, isLoading } = useCouponsGetByID(isEditMode ? couponID : null);

    const setValues = (e) => {
        let { id, value } = e.target
        setDefaultValues((prev) => ({ ...prev, [id]: value }));
    }

    const handleDateSelect = (date) => {
        setDefaultValues((prev) => ({ ...prev, expireDate: formatDate(date) }))
    }

    const { updateCoupon } = useCouponPut();
    //const { createCoupon } = useCouponPost(); // Assuming you have this hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate(defaultValues);
        setFieldError(validationErrors);

        if (Object.keys(validationErrors).length !== 0)
            return;

        try {
            if (isEditMode) {
                await updateCoupon(defaultValues, user.token);
                toast.success("Coupon updated!");
            } else {
                //await createCoupon(defaultValues, user.token);
                toast.success("Coupon created!");
            }
            navigate("/main/home");
        } catch (error) {
            toast.error(`Failed to ${isEditMode ? 'update' : 'create'} coupon`, {
                description: error.message
            });
        }
    }

    useEffect(() => {
        // Only process data if we're in edit mode and have data
        if (data && isEditMode) {
            setDefaultValues({
                id: couponID,
                name: data.name || "",
                couponCode: data.couponCode || "",
                isActive: data.isActive ?? false,
                percentage: data.percentage ?? 0,
                expireDate: data.expireDate,
            })
        }

        // Only show error if we're trying to edit but have an error
        if (error && isEditMode) {
            toast.error("Error", {
                duration: 5000,
                dismissible: true,
                description: error.message,
            })
        }

    }, [data, error, couponID, isEditMode])

    const progress = useLoader(isLoading)

    // Show loading only when we're editing and actually loading data
    if (isLoading && isEditMode) {
        return (
            <div className="flex items-center justify-center w-screen h-screen bg-white">
                <div className="w-64">
                    <Progress value={progress} className="w-full" />
                </div>
            </div>
        )
    }

    // Show error only when editing and no data found
    if (!data && isEditMode && !isLoading) {
        return (
            <div className="flex items-center justify-center w-screen h-screen bg-white">
                <p className="text-red-500">No data found for the given coupon ID.</p>
            </div>
        )
    }

    return (
        <div className="py-8 px-4 max-w-7xl mx-auto pt-30">
            <Card>
                <CardHeader className="pb-6">
                    <div className="flex justify-between">
                        <div className="space-y-2">
                            <CardTitle className="text-3xl font-bold">
                                {operation === "new" ? "Create" : operation.charAt(0).toUpperCase() + operation.slice(1)} Coupon
                            </CardTitle>
                            <p className="text-muted-foreground">
                                Here you can {operation === "new" ? "create" : operation} a coupon with all necessary details
                            </p>
                        </div>
                        <div>
                            <Button variant="outline" onClick={() => navigate("/main/home")}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Coupon Name<strong className="text-red-500">*</strong>
                                </Label>
                                <Input
                                    value={defaultValues.name || ""}
                                    onChange={(e) => {
                                        setValues(e);
                                        setDefaultValues((prev) => ({
                                            ...prev,
                                            "couponCode": e.target.value.toUpperCase() + defaultValues.percentage
                                        }));
                                    }}
                                    type="text"
                                    id="name"
                                    placeholder="Enter coupon name"
                                    className="h-11"
                                />
                                <p className="text-red-500 text-sm">{FieldError.couponName}</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="couponCode" className="text-sm font-medium">
                                    Coupon Code<strong className="text-red-500">*</strong>
                                </Label>
                                <Input
                                    value={defaultValues.couponCode || ""}
                                    type="text"
                                    id="couponCode"
                                    placeholder="Enter coupon code"
                                    className="h-11 disabled:bg-gray-50 disabled:text-gray-500"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    {/* Discount Configuration Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Discount Configuration</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <Label htmlFor="percentage" className="text-sm font-medium">
                                    Discount Percentage<strong className="text-red-500">*</strong>
                                </Label>
                                <div className="space-y-4">
                                    <Input
                                        type="number"
                                        id="percentage"
                                        placeholder="0"
                                        value={defaultValues.percentage || 0}
                                        onChange={(e) => {
                                            setValues(e);
                                            setDefaultValues((prev) => ({
                                                ...prev,
                                                "couponCode": defaultValues.name.toUpperCase() + e.target.value
                                            }));
                                        }}
                                        min="0"
                                        max="100"
                                        className="h-11"
                                    />
                                    <div className="px-2">
                                        <Slider
                                            onValueChange={(e) => {
                                                setDefaultValues((prev) => ({
                                                    ...prev,
                                                    percentage: e[0],
                                                    couponCode: defaultValues.name.toUpperCase() + e[0]
                                                }));
                                            }}
                                            max={100}
                                            step={1}
                                            value={[defaultValues.percentage || 0]}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                            <span>0%</span>
                                            <span className="font-medium">{defaultValues.percentage}%</span>
                                            <span>100%</span>
                                        </div>
                                    </div>
                                    <p className="text-red-500 text-sm">{FieldError.percentage}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Expiry Date
                                        <strong className="text-red-500">*</strong></Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full h-11 justify-start text-left font-normal",
                                                    !defaultValues.expireDate && "text-muted-foreground",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {defaultValues.expireDate ? (
                                                    format(defaultValues.expireDate, "PPP")
                                                ) : (
                                                    <span>Pick expiry date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={defaultValues.expireDate}
                                                onSelect={handleDateSelect}
                                                disabled={date => date < new Date()}
                                                month={defaultValues.expireDate || new Date()}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <p className="text-red-500 text-sm">{FieldError.expiryDate}</p>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Coupon Status</Label>
                                    <div className={`${!defaultValues.isActive ? "border-red-200 bg-red-50" : ""} flex items-center justify-between p-4 border rounded-lg bg-muted/30`}>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">{defaultValues.isActive ? "Active" : "Inactive"}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Coupon is currently {defaultValues.isActive ? "active" : "inactive"}
                                            </p>
                                        </div>
                                        <Switch
                                            id="isActive"
                                            checked={defaultValues.isActive || false}
                                            onCheckedChange={(val) => setDefaultValues((prev) => ({ ...prev, isActive: val }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t">
                        <Button onClick={handleSubmit} className="px-8 h-11">
                            {isEditMode ? "Update" : "Create"} Coupon
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CouponFields