import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import Navbar from '../components/Navbar';

const Overview = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // In a real application, you would fetch the list of accumulated companies from your backend
    // For this example, we'll simulate it with some dummy data
    const dummyCompanies = [
      { name: 'TechCorp', industry: 'Technology', employees: 500 },
      { name: 'MediHealth', industry: 'Healthcare', employees: 1000 },
      { name: 'GreenEnergy', industry: 'Renewable Energy', employees: 250 },
    ];
    setCompanies(dummyCompanies);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100">
      <Navbar />
      <div className="p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-blue-600">Accumulated Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map((company, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 flex items-center space-x-4">
                    <Building2 className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">{company.name}</h3>
                      <p className="text-sm text-gray-500">Industry: {company.industry}</p>
                      <p className="text-sm text-gray-500">Employees: {company.employees}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
