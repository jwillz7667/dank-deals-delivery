import { AlertTriangle, CheckCircle } from "lucide-react"

export default function Disclaimer() {
  return (
    <div className="bg-red-50 border-red-500 border-2 p-6 rounded-lg my-8">
      <div className="flex items-start">
        <AlertTriangle className="h-6 w-6 mr-3 mt-0.5 text-red-600 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-lg text-black mb-3">Important Delivery Requirements</h4>
          <ul className="space-y-3 text-black">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-red-600 flex-shrink-0" />
              <div>
                <strong>Age Verification:</strong> Must be 21+ with valid state-issued photo ID
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-red-600 flex-shrink-0" />
              <div>
                <strong>Address Matching:</strong> ID address must match delivery location
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-red-600 flex-shrink-0" />
              <div>
                <strong>Pre-Payment Required:</strong> All orders must be paid before delivery for driver safety
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-red-600 flex-shrink-0" />
              <div>
                <strong>Service Hours:</strong> Daily delivery available from 10 AM to 10 PM
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
