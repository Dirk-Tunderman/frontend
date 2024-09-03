import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import Navbar from '../components/Navbar';

const Overview = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  useEffect(() => {
    // Simulating fetching companies from an API
    const dummyCompanies = [
      { id: 1, industry: 'Technology', location: 'San Francisco, CA' },
      { id: 2, industry: 'Healthcare', location: 'Boston, MA' },
      { id: 3, industry: 'Renewable Energy', location: 'Austin, TX' },
      { id: 4, industry: 'Finance', location: 'New York, NY' },
      { id: 5, industry: 'E-commerce', location: 'Seattle, WA' },
    ];
    setCompanies(dummyCompanies);
  }, []);

  const handleCompanySelection = (companyId) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleSubmit = () => {
    console.log('Selected companies:', selectedCompanies);
    // Here you would typically send the selected companies to your backend
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Accumulated Companies</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {companies.map((company) => (
            <Card key={company.id} className="bg-gray-800 border border-orange-300 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="h-6 w-6 text-orange-500" />
                  <Checkbox
                    checked={selectedCompanies.includes(company.id)}
                    onCheckedChange={() => handleCompanySelection(company.id)}
                    className="border-orange-500"
                  />
                </div>
                <h3 className="font-semibold text-white text-lg mb-1">{company.industry}</h3>
                <p className="text-sm text-gray-300">{company.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2">
            Submit Selected Companies
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Overview;