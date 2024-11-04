import { useState } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Navbar from '../components/Navbar';

const Index = () => {
  // Location Scraper State
  const [place, setPlace] = useState('');
  const [profession, setProfession] = useState('');
  
  // LinkedIn Scraper State
  const [useDefaultCredentials, setUseDefaultCredentials] = useState(false);
  const [linkedinUsername, setLinkedinUsername] = useState('');
  const [linkedinPassword, setLinkedinPassword] = useState('');
  const [itemsToScrape, setItemsToScrape] = useState('');
  const [jsonFilename, setJsonFilename] = useState('');
  const [url, setUrl] = useState('');
  
  // Shared State
  const [results, setResults] = useState({ location: null, linkedin: null });
  const [loading, setLoading] = useState({ location: false, linkedin: false });
  const [error, setError] = useState({ location: null, linkedin: null });

  // Handle default credentials toggle
  const handleCredentialsToggle = (checked) => {
    setUseDefaultCredentials(checked);
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, location: true });
    setError({ ...error, location: null });

    if (!place || !profession) {
      setError({ ...error, location: 'Please fill in all fields for Location Scraper' });
      setLoading({ ...loading, location: false });
      return;
    }

    try {
      const response = await axios.post('/api/scrape', { 
        type: 'location',
        place, 
        profession 
      });
      setResults({ ...results, location: response.data.location });
    } catch (err) {
      setError({ ...error, location: err.response?.data?.error || 'An error occurred' });
    } finally {
      setLoading({ ...loading, location: false });
    }
  };

  const handleLinkedInSubmit = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, linkedin: true });
    setError({ ...error, linkedin: null });

    if (!useDefaultCredentials && (!linkedinUsername || !linkedinPassword)) {
      setError({ ...error, linkedin: 'Please provide credentials or use default account' });
      setLoading({ ...loading, linkedin: false });
      return;
    }

    if (!itemsToScrape || !jsonFilename || !url) {
      setError({ ...error, linkedin: 'Please fill in all required fields' });
      setLoading({ ...loading, linkedin: false });
      return;
    }

    try {
      const response = await axios.post('/api/scrape', {
        type: 'linkedin',
        linkedin: {
          useDefaultCredentials,
          username: linkedinUsername,
          password: linkedinPassword,
          itemsToScrape: parseInt(itemsToScrape, 10),
          jsonFilename: jsonFilename.endsWith('.json') ? jsonFilename : `${jsonFilename}.json`,
          url
        }
      });
      setResults({ ...results, linkedin: response.data.linkedin });
    } catch (err) {
      setError({ ...error, linkedin: err.response?.data?.error || 'An error occurred' });
    } finally {
      setLoading({ ...loading, linkedin: false });
    }
  };

  const renderResults = (type) => {
    const data = results[type];
    if (!data) return null;

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2 text-white">{type.charAt(0).toUpperCase() + type.slice(1)} Results:</h3>
        <div className="space-y-4">
          {data.map((item, index) => (
            <Card key={index} className="bg-gray-800">
              <CardContent className="p-4">
                <h4 className="font-bold text-white">{item.name || item.company}</h4>
                {item.function && <p className="text-gray-300">Function: {item.function}</p>}
                {item.company && <p className="text-gray-300">Company: {item.company}</p>}
                {item.location && <p className="text-gray-300">Location: {item.location}</p>}
                {item.industry && <p className="text-gray-300">Industry: {item.industry}</p>}
                {item.size && <p className="text-gray-300">Size: {item.size}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Get a list of Companies</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Location Scraper Card */}
          <Card className="flex-1 border-2 border-orange-500 bg-black text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-orange-500">Local Businesses</CardTitle>
              <CardDescription className="text-gray-300">
                Local business scraper. Scrapes google maps so input accordingly.
                Works best for small and midsize businesses who are present online.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLocationSubmit} className="space-y-4">
                <Input
                  placeholder="Enter a place (e.g., New York, London)"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="w-full bg-gray-800 text-white"
                />
                <Input
                  placeholder="Enter a profession/industry"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full bg-gray-800 text-white"
                />
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled={loading.location}>
                  {loading.location ? 'Searching...' : <><Search className="mr-2 h-4 w-4" /> Search</>}
                </Button>
              </form>
              {error.location && <div className="mt-4 text-red-500">{error.location}</div>}
              {renderResults('location')}
            </CardContent>
          </Card>

          {/* LinkedIn Scraper Card */}
          <Card className="flex-1 border-2 border-orange-500 bg-black text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-orange-500">LinkedIn Sales Navigator</CardTitle>
              <CardDescription className="text-gray-300">
                Go to LinkedIn sales nav, put in your criteria there, copy the URL and put it in the box here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLinkedInSubmit} className="space-y-4">
                {/* Default Credentials Toggle */}
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="use-default-credentials"
                    checked={useDefaultCredentials}
                    onCheckedChange={handleCredentialsToggle}
                  />
                  <Label htmlFor="use-default-credentials" className="text-white">
                    Use Default Account
                  </Label>
                </div>

                {/* Manual Credentials (shown only if not using default) */}
                {!useDefaultCredentials && (
                  <>
                    <Input
                      placeholder="LinkedIn Username"
                      value={linkedinUsername}
                      onChange={(e) => setLinkedinUsername(e.target.value)}
                      className="w-full bg-gray-800 text-white"
                    />
                    <Input
                      type="password"
                      placeholder="LinkedIn Password"
                      value={linkedinPassword}
                      onChange={(e) => setLinkedinPassword(e.target.value)}
                      className="w-full bg-gray-800 text-white"
                    />
                  </>
                )}

                <Input
                  type="number"
                  placeholder="Amount"
                  value={itemsToScrape}
                  onChange={(e) => setItemsToScrape(e.target.value)}
                  className="w-full bg-gray-800 text-white"
                />
                <Input
                  placeholder="Campain Name"
                  value={jsonFilename}
                  onChange={(e) => setJsonFilename(e.target.value)}
                  className="w-full bg-gray-800 text-white"
                />
                <Input
                  placeholder="LinkedIn Sales Navigator URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-gray-800 text-white"
                />
                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white" 
                  disabled={loading.linkedin}
                >
                  {loading.linkedin ? 'Searching...' : <><Search className="mr-2 h-4 w-4" /> Search</>}
                </Button>
              </form>
              {error.linkedin && <div className="mt-4 text-red-500">{error.linkedin}</div>}
              {renderResults('linkedin')}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;