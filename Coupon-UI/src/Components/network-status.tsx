"use client"

import { useOnlineStatus } from "../Utility/use-online-status"
import { Alert, AlertDescription } from "@/Components/ui/alert"
import { Badge } from "@/Components/ui/badge"
import { Card, CardContent } from "@/Components/ui/card"
import { Wifi, WifiOff, CheckCircle, AlertCircle } from "lucide-react"

interface NetworkStatusProps {
    variant?: "badge" | "alert" | "card" | "signal"
    showIcon?: boolean
    className?: string
}

export function NetworkStatus({ variant = "badge", showIcon = true, className = "" }: NetworkStatusProps) {
    const isOnline = useOnlineStatus()

    if (variant === "badge") {
        return (
            <Badge variant={isOnline ? "default" : "destructive"} className={`flex items-center gap-2 ${className}`}>
                {showIcon && (isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />)}
                {isOnline ? "Online" : "Offline"}
            </Badge>
        )
    }

    if (variant === "signal") {
        return (
            !isOnline ? (
                <div className="relative flex items-center justify-center">
                    <span className="absolute w-2 h-2 rounded-full bg-green-500 opacity-75 animate-[ping_2s_linear_infinite]"></span>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-[pulse_2s_infinite] shadow-[0_0_6px_3px_rgba(34,197,94,0.7)]"></span>
                </div>
            ) : (
                <div className="relative flex items-center justify-center">
                    <span className="absolute w-2 h-2 rounded-full bg-red-500 opacity-75 animate-[ping_1.2s_linear_infinite]"></span>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-[pulse_2s_infinite] shadow-[0_0_6px_3px_rgba(239,68,68,0.6)]"></span>
                </div>
            )
        );
    }


    if (variant === "alert") {
        return (
            <Alert
                className={`${isOnline ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950" : ""} ${className}`}
            >
                {showIcon &&
                    (isOnline ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4" />)}
                <AlertDescription className={isOnline ? "text-green-800 dark:text-green-200" : ""}>
                    {isOnline
                        ? "You are connected to the internet. All features are available."
                        : "You are currently offline. Some features may be limited."}
                </AlertDescription>
            </Alert>
        )
    }

    if (variant === "card") {
        return (
            <Card className={`${className}`}>
                <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        {showIcon &&
                            (isOnline ? <Wifi className="h-5 w-5 text-green-600" /> : <WifiOff className="h-5 w-5 text-red-600" />)}
                        <div>
                            <p className="font-medium">{isOnline ? "Connected" : "Disconnected"}</p>
                            <p className="text-sm text-muted-foreground">
                                {isOnline ? "Internet connection is active" : "No internet connection detected"}
                            </p>
                        </div>
                    </div>
                    <Badge variant={isOnline ? "default" : "destructive"}>{isOnline ? "Online" : "Offline"}</Badge>
                </CardContent>
            </Card>
        )
    }

    return null
}
