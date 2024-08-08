import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import Navbar from '../components/Navbar';

const Index = () => {
  const [place, setPlace] = useState('');
  const [profession, setProfession] = useState('');
  const [results, setResults] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to fetch the data
    // For now, we'll just set some dummy results
    setResults({
      companies: [
        { name: "TechCorp", industry: "Technology", employees: 500 },
        { name: "MediHealth", industry: "Healthcare", employees: 1000 },
        { name: "GreenEnergy", industry: "Renewable Energy", employees: 250 },
      ]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <Navbar />
      <div className="p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-blue-600">Company Data Accumulator</CardTitle>
          <CardDescription className="text-center text-gray-600">
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
                className="w-full"
              />
            </div>
            <div>
              <Input
                placeholder="Enter a profession/industry (e.g., Technology, Healthcare)"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </form>

          {results && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Results:</h2>
              <div className="space-y-4">
                {results.companies.map((company, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h3 className="font-bold">{company.name}</h3>
                      <p>Industry: {company.industry}</p>
                      <p>Employees: {company.employees}</p>
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
