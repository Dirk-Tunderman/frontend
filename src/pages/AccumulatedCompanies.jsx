import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AccumulatedCompanies = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // In a real application, you would fetch the accumulated companies from your backend
    // For this example, we'll use dummy data
    const dummyCompanies = [
      { name: "TechCorp", industry: "Technology", employees: 500, location: "New York" },
      { name: "MediHealth", industry: "Healthcare", employees: 1000, location: "London" },
      { name: "GreenEnergy", industry: "Renewable Energy", employees: 250, location: "Berlin" },
      { name: "FinanceHub", industry: "Finance", employees: 750, location: "Tokyo" },
    ];
    setCompanies(dummyCompanies);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-blue-600">Accumulated Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.industry}</TableCell>
                  <TableCell>{company.employees}</TableCell>
                  <TableCell>{company.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccumulatedCompanies;
