import { AlertTriangle } from "lucide-react"

export default function Disclaimer() {
  return (
    <div className="bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-200 p-6 rounded-r-lg my-8">
      <div className="flex items-center">
        <AlertTriangle className="h-8 w-8 mr-4 text-yellow-500" />
        <div>
          <h4 className="font-bold text-lg text-yellow-400">Important Delivery Information</h4>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            <li>
              <span className="font-semibold">Pre-payment is required</span> for all orders to ensure driver safety.
            </li>
            <li>
              A <span className="font-semibold">valid state ID matching the delivery address</span> must be presented
              upon receipt.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
