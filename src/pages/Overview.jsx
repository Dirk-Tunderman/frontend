import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import Navbar from '../components/Navbar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Overview = () => {
  const [companies, setCompanies] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('/api/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
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
              key={company.name} 
              className="bg-gray-800 border border-orange-300 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleCompanyClick(company.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-1">{company.profession}</h3>
                <p className="text-sm text-gray-300">{company.location}</p>
                <p className="text-sm text-gray-300">{company.date}</p>
                <p className={`text-sm mt-2 ${company.enriched ? 'text-green-500' : 'text-red-500'}`}>
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