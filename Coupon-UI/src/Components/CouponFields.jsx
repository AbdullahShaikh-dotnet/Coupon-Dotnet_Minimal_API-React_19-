import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Button } from "@/Components/ui/button"
import { Switch } from "@/Components/ui/switch"
import { Slider } from "@/Components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { Calendar } from "@/Components/ui/calendar"
import { CalendarIcon, ArrowLeft, Percent, Tag, CalendarDays, ToggleLeft } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import useLoader from "../Utility/useLoader"
import { useCouponsGetByID, useCouponPut, useCouponPost } from "../Utility/useCoupons"
import { Progress } from "@/Components/ui/progress"
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Alert, AlertDescription } from "@/Components/ui/alert"
import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router"

import UserContext from "../Utility/UserContext"

const CouponFields = () => {
    const { couponID, operation } = useParams()
    const [FieldError, setFieldError] = useState({})
    const navigate = useNavigate()
    const { user, token } = useContext(UserContext)

    // Determine if we're in edit mode
    const isEditMode = operation === "edit" && couponID

    const [defaultValues, setDefaultValues] = useState({
        id: isEditMode ? couponID : 0,
        name: "",
        couponCode: "",
        isActive: false,
        percentage: 0,
        expireDate: "2025-09-01",
    })

    const [selectedDate, setSelectedDate] = useState(() => {
        return new Date(defaultValues.expireDate)
    })

    const validate = (values) => {
        const newErrors = {}

        if (!values.name.trim()) {
            newErrors.couponName = "Coupon name is required."
        }
        if (!values.couponCode.trim()) {
            newErrors.couponCode = "Coupon code is required."
        }
        if (values.percentage <= 0 || values.percentage > 100) {
            newErrors.percentage = "Percentage must be between 1 and 100."
        }
        if (new Date(values.expireDate) <= new Date()) {
            newErrors.expireDate = "Expiry date must be in the future."
        }

        return newErrors
    }

    function formatDate(date) {
        return date.toISOString().split("T")[0] // gives yyyy-MM-dd
    }

    // Only fetch data if we're in edit mode
    const { data, error, isLoading } = useCouponsGetByID(isEditMode ? couponID : null)

    const setValues = (e) => {
        const { id, value } = e.target
        setDefaultValues((prev) => ({ ...prev, [id]: value }))
    }

    const handleDateSelect = (date) => {
        if (date) {
            setSelectedDate(date)
            setDefaultValues((prev) => ({ ...prev, expireDate: formatDate(date) }))
        }
    }

    const { updateCoupon } = useCouponPut()
    const { createCoupon } = useCouponPost();

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validate(defaultValues)
        setFieldError(validationErrors)

        if (Object.keys(validationErrors).length !== 0) return

        try {
            if (isEditMode) {
                await updateCoupon(defaultValues, token)
                toast.success("Coupon updated successfully!")
            } else {

                const postObject = {
                    name: defaultValues.name,
                    percentage: defaultValues.percentage,
                    expireDate: defaultValues.expireDate,
                    isActive: defaultValues.isActive
                }

                await createCoupon(postObject, token);
                toast.success("Coupon created successfully!")
            }
            navigate("/main/home")
        } catch (error) {
            toast.error(`Failed to ${isEditMode ? "update" : "create"} coupon`, {
                description: error.message,
            })
        }
    }

    useEffect(() => {
        // Only process data if we're in edit mode and have data
        if (data && isEditMode) {
            const newValues = {
                id: couponID,
                name: data.name || "",
                couponCode: data.couponCode || "",
                isActive: data.isActive ?? false,
                percentage: data.percentage ?? 0,
                expireDate: data.expireDate,
            }
            setDefaultValues(newValues)
            setSelectedDate(new Date(data.expireDate))
        }

        // Only show error if we're trying to edit but have an error
        if (error && isEditMode) {
            toast.error("Error loading coupon", {
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
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-80 space-y-4 text-center">
                    <div className="animate-pulse">
                        <Tag className="h-8 w-8 mx-auto text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Loading coupon...</h3>
                        <Progress value={progress} className="w-full" />
                    </div>
                </div>
            </div>
        )
    }

    // Show error only when editing and no data found
    if (!data && isEditMode && !isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card className="w-96">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <Tag className="h-12 w-12 mx-auto text-muted-foreground" />
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">Coupon Not Found</h3>
                                <p className="text-sm text-muted-foreground">
                                    The coupon you're looking for doesn't exist or has been removed.
                                </p>
                            </div>
                            <Button onClick={() => navigate("/main/home")} variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Go Back
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-7xl mx-auto py-8 px-4">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/main/home")}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Coupons
                        </Button>
                        <Badge variant={isEditMode ? "secondary" : "default"}>{isEditMode ? "Edit Mode" : "Create New"}</Badge>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? "Edit Coupon" : "Create New Coupon"}</h1>
                        <p className="text-muted-foreground text-lg">
                            {isEditMode
                                ? "Update your coupon details and settings"
                                : "Set up a new discount coupon for your customers"}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Tag className="h-5 w-5 text-primary" />
                                <CardTitle>Basic Information</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
                                        Coupon Name
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        value={defaultValues.name || ""}
                                        onChange={(e) => {
                                            setValues(e)
                                            setDefaultValues((prev) => ({
                                                ...prev,
                                                couponCode: e.target.value.toUpperCase() + defaultValues.percentage,
                                            }))
                                        }}
                                        type="text"
                                        id="name"
                                        placeholder="e.g., Summer Sale, Black Friday"
                                        className={cn("h-11", FieldError.couponName && "border-destructive focus-visible:ring-destructive")}
                                    />
                                    {FieldError.couponName && (
                                        <Alert variant="destructive" className="py-2">
                                            <AlertDescription className="text-sm">{FieldError.couponName}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="couponCode" className="text-sm font-medium">
                                        Coupon Code
                                        <Badge variant="secondary" className="ml-2 text-xs">
                                            Auto-generated
                                        </Badge>
                                    </Label>
                                    <Input
                                        value={defaultValues.couponCode || ""}
                                        type="text"
                                        id="couponCode"
                                        placeholder="Will be generated automatically"
                                        className="h-11 bg-muted/50 text-muted-foreground"
                                        disabled
                                    />
                                    <p className="text-xs text-muted-foreground">Generated from coupon name and discount percentage</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Discount Configuration Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Percent className="h-5 w-5 text-primary" />
                                <CardTitle>Discount Configuration</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Discount Percentage */}
                                <div className="space-y-4">
                                    <Label htmlFor="percentage" className="text-sm font-medium flex items-center gap-1">
                                        Discount Percentage
                                        <span className="text-destructive">*</span>
                                    </Label>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                id="percentage"
                                                placeholder="0"
                                                value={defaultValues.percentage || 0}
                                                onChange={(e) => {
                                                    setValues(e)
                                                    setDefaultValues((prev) => ({
                                                        ...prev,
                                                        couponCode: defaultValues.name.toUpperCase() + e.target.value,
                                                    }))
                                                }}
                                                min="0"
                                                max="100"
                                                className={cn(
                                                    "h-11 pr-8",
                                                    FieldError.percentage && "border-destructive focus-visible:ring-destructive",
                                                )}
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</div>
                                        </div>

                                        <div className="space-y-3">
                                            <Slider
                                                onValueChange={(e) => {
                                                    setDefaultValues((prev) => ({
                                                        ...prev,
                                                        percentage: e[0],
                                                        couponCode: defaultValues.name.toUpperCase() + e[0],
                                                    }))
                                                }}
                                                max={100}
                                                step={1}
                                                value={[defaultValues.percentage || 0]}
                                                className="w-full"
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>0%</span>
                                                <Badge variant="outline" className="text-xs font-medium">
                                                    {defaultValues.percentage}% OFF
                                                </Badge>
                                                <span>100%</span>
                                            </div>
                                        </div>

                                        {FieldError.percentage && (
                                            <Alert variant="destructive" className="py-2">
                                                <AlertDescription className="text-sm">{FieldError.percentage}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                </div>

                                {/* Expiry Date and Status */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium flex items-center gap-1">
                                            <CalendarDays className="h-4 w-4" />
                                            Expiry Date
                                            <span className="text-destructive">*</span>
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full h-11 justify-start text-left font-normal",
                                                        !defaultValues.expireDate && "text-muted-foreground",
                                                        FieldError.expireDate && "border-destructive",
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {defaultValues.expireDate ? (
                                                        format(new Date(defaultValues.expireDate), "PPP")
                                                    ) : (
                                                        <span>Select expiry date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDate}
                                                    onSelect={handleDateSelect}
                                                    disabled={(date) => date < new Date()}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {FieldError.expireDate && (
                                            <Alert variant="destructive" className="py-2">
                                                <AlertDescription className="text-sm">{FieldError.expireDate}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium flex items-center gap-1">
                                            <ToggleLeft className="h-4 w-4" />
                                            Coupon Status
                                        </Label>
                                        <Card
                                            className={cn(
                                                "transition-colors",
                                                defaultValues.isActive
                                                    ? "border-green-200 bg-green-50/50"
                                                    : "border-orange-200 bg-orange-50/50",
                                            )}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Badge
                                                                variant={defaultValues.isActive ? "default" : "secondary"}
                                                                className={cn(
                                                                    defaultValues.isActive
                                                                        ? "bg-green-100 text-green-800 border-green-200"
                                                                        : "bg-orange-100 text-orange-800 border-orange-200",
                                                                )}
                                                            >
                                                                {defaultValues.isActive ? "Active" : "Inactive"}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {defaultValues.isActive
                                                                ? "Customers can use this coupon"
                                                                : "Coupon is disabled for customers"}
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        id="isActive"
                                                        checked={defaultValues.isActive || false}
                                                        onCheckedChange={(val) => setDefaultValues((prev) => ({ ...prev, isActive: val }))}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6">
                        <Button type="button" variant="outline" onClick={() => navigate("/main/home")} className="sm:w-auto">
                            Cancel
                        </Button>
                        <Button type="submit" className="sm:w-auto px-8">
                            {isEditMode ? "Update Coupon" : "Create Coupon"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CouponFields
