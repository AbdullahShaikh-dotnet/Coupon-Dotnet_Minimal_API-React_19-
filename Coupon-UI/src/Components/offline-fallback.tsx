import { useState } from "react"
import { useOnlineStatus } from "../Utility/use-online-status"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { WifiOff, RefreshCw, Loader2 } from "lucide-react"
import type { ReactNode } from "react"

interface OfflineFallbackProps {
    children: ReactNode
    fallbackTitle?: string
    fallbackDescription?: string
    showRetry?: boolean
    onRetry?: () => void
}

export function OfflineFallback({
    children,
    fallbackTitle = "You're offline",
    fallbackDescription = "Please check your internet connection and try again.",
    showRetry = true,
    onRetry,
}: OfflineFallbackProps) {
    const isOnline = useOnlineStatus()
    const [isRetrying, setIsRetrying] = useState(false)

    const handleRetry = async () => {
        if (onRetry) {
            onRetry()
            return
        }

        setIsRetrying(true)

        // Wait a moment to show the loading state
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check if we're back online by forcing a small network request
        try {
            await fetch("/favicon.ico", {
                method: "HEAD",
                cache: "no-cache",
            })
            // If successful, the online event should fire automatically
        } catch (error) {
            // Still offline, just reset the retry state
            console.log("Still offline after retry attempt")
        }

        setIsRetrying(false)
    }

    if (!isOnline) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-none shadow-none">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-50 w-50 items-center justify-center rounded-full bg-muted">
                            <WifiOff className="h-30 w-30 text-muted-foreground" />
                        </div>
                        <CardTitle>{fallbackTitle}</CardTitle>
                        <CardDescription>{fallbackDescription}</CardDescription>
                    </CardHeader>
                    {showRetry && (
                        <CardContent className="text-center">
                            <Button onClick={handleRetry} variant="outline" className="w-full bg-transparent" disabled={isRetrying}>
                                {isRetrying ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Checking Connection...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Try Again
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    )}
                </Card>
            </div>
        )
    }

    return <>{children}</>
}
