import { Card } from "@/components/ui/card";

const ParserConfigGuide = () => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-4">Parser Configuration Guide</h2>
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">Required HTML Structure</h3>
        <p className="text-sm text-gray-600">
          The HTML input should begin with and contain the content of: <code>&lt;div id="Sva75c" jsname="Sva75c"&gt;</code>
        </p>
      </div>
      
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
        <h3 className="font-medium">Database Configuration</h3>
        <p className="text-sm text-gray-600">
          To change the Supabase database connection, update the following environment variables in your .env file:
        </p>
        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs">
          VITE_SUPABASE_URL=your_project_url{"\n"}
          VITE_SUPABASE_ANON_KEY=your_anon_key
        </pre>
      </div>

      <div>
        <h3 className="font-medium">Authentication Redirect URL</h3>
        <p className="text-sm text-gray-600">
          To change the redirect URL after GitHub authentication (default: localhost:3000), update the Site URL in your Supabase project:
        </p>
        <ol className="list-decimal list-inside text-sm text-gray-600 mt-2 space-y-1">
          <li>Go to your Supabase project dashboard</li>
          <li>Navigate to Authentication {'>'} URL Configuration</li>
          <li>Update the Site URL field with your production URL</li>
          <li>Click Save to apply the changes</li>
        </ol>
      </div>

      <div>
        <h3 className="font-medium">HTML Copy Bookmarklet</h3>
        <p className="text-sm text-gray-600 mb-2">
          Use this bookmarklet to easily copy the required HTML content. Create a new bookmark with this JavaScript code as the URL:
        </p>
        <pre className="p-2 bg-gray-100 rounded text-xs overflow-x-auto">
          {`javascript:(function(){
    var targetElement = document.querySelector('#Sva75c');
    if (targetElement) {
        var showMoreButton = targetElement.querySelector('null.nNzjpf-cS4Vcb-PvZLI-vK2bNd-fmcmS');
        if (showMoreButton) {
            showMoreButton.click();
            setTimeout(function(){
                navigator.clipboard.writeText(targetElement.outerHTML)
                .then(function(){alert("Kode HTML Selengkapnya dari Listing sebelumnya, disalin ke clipboard.");})
                .catch(function(err){alert("Gagal menyalin ke clipboard: "+err);});
            }, 1000);
        } else {
            navigator.clipboard.writeText(targetElement.outerHTML)
            .then(function(){alert("Kode HTML dari Listing sebelumnya disalin ke clipboard.");})
            .catch(function(err){alert("Gagal menyalin ke clipboard: "+err);});
        }
    } else {
        alert("Elemen ID Sva75c tidak ditemukan.");
    }
})();`}
        </pre>
      </div>
    </div>
  </Card>
);

export default ParserConfigGuide;