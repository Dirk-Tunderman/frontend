import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import Navbar from '../components/Navbar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Overview = () => {
  const [companies, setCompanies] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating fetching companies from an API
    const dummyCompanies = [
      { id: 1, name: 'TechCorp', industry: 'Technology', location: 'San Francisco, CA', enriched: true },
      { id: 2, name: 'MediHealth', industry: 'Healthcare', location: 'Boston, MA', enriched: false },
      { id: 3, name: 'GreenEnergy', industry: 'Renewable Energy', location: 'Austin, TX', enriched: true },
      { id: 4, name: 'FinanceHub', industry: 'Finance', location: 'New York, NY', enriched: false },
      { id: 5, name: 'ShopNow', industry: 'E-commerce', location: 'Seattle, WA', enriched: true },
    ];
    setCompanies(dummyCompanies);
  }, []);

  const handleCompanyClick = (companyId) => {
    navigate(`/company/${companyId}`);
  };

  const filteredCompanies = companies.filter(company => {
    if (filter === 'all') return true;
    if (filter === 'enriched') return company.enriched;
    if (filter === 'not-enriched') return !company.enriched;
    return true;
  });

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Accumulated Companies</h1>
        <div className="mb-6 max-w-xs mx-auto">
          <Select onValueChange={setFilter} defaultValue="all">
            <SelectTrigger className="w-full bg-gray-800 text-white border-orange-500">
              <SelectValue placeholder="Filter companies" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-orange-500">
              <SelectItem value="all">All Companies</SelectItem>
              <SelectItem value="enriched">Enriched Companies</SelectItem>
              <SelectItem value="not-enriched">Not Enriched Companies</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCompanies.map((company) => (
            <Card 
              key={company.id} 
              className="bg-gray-800 border border-orange-300 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleCompanyClick(company.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-1">{company.name}</h3>
                <p className="text-sm text-gray-300">{company.industry}</p>
                <p className="text-sm text-gray-300">{company.location}</p>
                <p className="text-sm text-orange-500 mt-2">
                  {company.enriched ? 'Enriched' : 'Not Enriched'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;