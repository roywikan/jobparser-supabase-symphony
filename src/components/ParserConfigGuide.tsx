import { Card } from "@/components/ui/card";

const ParserConfigGuide = () => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-4">Parser Configuration Guide</h2>
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">Supported Currency Symbols</h3>
        <p className="text-sm text-gray-600">
          Rp, US$, AU$, S$, SGD, IDR, AED, ₹, £
        </p>
      </div>
      
      <div>
        <h3 className="font-medium">Time Period Formats</h3>
        <p className="text-sm text-gray-600">
          per day, a day, per hour, an hour, per month, a month, per week, a week, per year, a year
        </p>
      </div>
      
      <div>
        <h3 className="font-medium">Base URL Configuration</h3>
        <p className="text-sm text-gray-600">
          To change the base URL, update the VITE_APP_URL environment variable in your .env file
        </p>
      </div>
    </div>
  </Card>
);

export default ParserConfigGuide;