import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
      { id: 1, name: 'TechCorp', website: 'www.techcorp.com', phone: '+1 (555) 123-4567' },
      { id: 2, name: 'MediHealth', website: 'www.medihealth.com', phone: '+1 (555) 987-6543' },
      { id: 3, name: 'GreenEnergy', website: 'www.greenenergy.com', phone: '+1 (555) 456-7890' },
      { id: 4, name: 'DataSoft', website: 'www.datasoft.com', phone: '+1 (555) 234-5678' },
      { id: 5, name: 'EcoFriendly', website: 'www.ecofriendly.com', phone: '+1 (555) 876-5432' },
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
        <Card className="max-w-6xl mx-auto border-2 border-orange-500 bg-black text-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-orange-500">Accumulated Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {companies.map((company) => (
                <Card key={company.id} className="hover:shadow-lg transition-shadow duration-300 border border-orange-300 bg-gray-800">
                  <CardContent className="p-4 flex flex-col items-start space-y-2">
                    <div className="flex items-center justify-between w-full">
                      <Building2 className="h-6 w-6 text-orange-500" />
                      <Checkbox
                        checked={selectedCompanies.includes(company.id)}
                        onCheckedChange={() => handleCompanySelection(company.id)}
                      />
                    </div>
                    <h3 className="font-semibold text-white">{company.name}</h3>
                    <p className="text-sm text-gray-300">{company.website}</p>
                    <p className="text-sm text-gray-300">{company.phone}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600 text-white">
                Submit Selected Companies
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;