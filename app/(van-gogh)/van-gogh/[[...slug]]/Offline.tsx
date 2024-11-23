import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-secondary">
      <h1 className="text-4xl font-light mb-4 text-white">Van Gogh Digital Guide</h1>
      <p className="text-xl mb-8 text-white/80">You are offline</p>
      <div className="space-y-4">
        <Button asChild variant="outline" className="w-full">
          <Link href="/van-gogh">Try Again</Link>
        </Button>
      </div>
    </div>
  )
}