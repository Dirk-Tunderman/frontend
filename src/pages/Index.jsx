import { useState } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import Navbar from '../components/Navbar';

const Index = () => {
  const [place, setPlace] = useState('');
  const [profession, setProfession] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/scrape', { place, profession });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <Card className="max-w-2xl mx-auto border-2 border-orange-500 bg-black text-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-orange-500">Company Data Accumulator</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Enter a place and profession/industry to find company information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Enter a place (e.g., New York, London)"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="w-full bg-gray-800 text-white"
                />
              </div>
              <div>
                <Input
                  placeholder="Enter a profession/industry (e.g., Technology, Healthcare)"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full bg-gray-800 text-white"
                />
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled={loading}>
                {loading ? 'Searching...' : <><Search className="mr-2 h-4 w-4" /> Search</>}
              </Button>
            </form>

            {error && (
              <div className="mt-4 text-red-500">
                {error}
              </div>
            )}

            {results && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-orange-500">Results:</h2>
                <div className="space-y-4">
                  {results.companies && results.companies.map((company, index) => (
                    <Card key={index} className="bg-gray-800">
                      <CardContent className="p-4">
                        <h3 className="font-bold text-white">{company.name}</h3>
                        <p className="text-gray-300">Industry: {company.industry}</p>
                        <p className="text-gray-300">Employees: {company.employees}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;