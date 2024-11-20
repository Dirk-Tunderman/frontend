import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database, Mail, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Navbar from '../components/Navbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';

const CompanyDetails = () => {
  const [companyData, setCompanyData] = useState([]);
  const [isEnriched, setIsEnriched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null // null -> upDown -> up -> down -> upDown...
  });
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(`/api/company/${id}`);
        setCompanyData(response.data);
        setIsEnriched(id.startsWith('result_'));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch company data');
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [id]);

  const handleSort = (key) => {
    let direction = 'up';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === null) direction = 'up';
      else if (sortConfig.direction === 'up') direction = 'down';
      else if (sortConfig.direction === 'down') direction = null;
    }

    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key || !sortConfig.direction) return companyData;

    const sorted = Object.entries(companyData).sort(([, a], [, b]) => {
      let aValue, bValue;

      if (sortConfig.key === 'employees') {
        aValue = a.company_info?.n_employees || 0;
        bValue = b.company_info?.n_employees || 0;
      } else if (sortConfig.key === 'points') {
        aValue = a.criteria_evaluation?.total_points || 0;
        bValue = b.criteria_evaluation?.total_points || 0;
      }

      if (sortConfig.direction === 'up') {
        return bValue - aValue; // Descending
      } else {
        return aValue - bValue; // Ascending
      }
    });

    return Object.fromEntries(sorted);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    if (sortConfig.direction === 'up') return <ArrowUp className="ml-2 h-4 w-4" />;
    if (sortConfig.direction === 'down') return <ArrowDown className="ml-2 h-4 w-4" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  const handleBack = () => {
    navigate('/overview');
  };

  const handleEnrichData = () => {
    navigate(`/set-criteria/${id}`);
  };

  const handleCreateOutreachScript = async () => {
    try {
      const response = await axios.post('/api/create-emails', { 
        companyData,
        filename: id
      });
      if (response.data.success) {
        toast.success("Outreach script created successfully!");
      } else {
        toast.error(response.data.message || "Failed to create outreach script. Please try again.");
      }
    } catch (error) {
      console.error("Error creating outreach script:", error);
      toast.error(error.response?.data?.message || error.message || "An error occurred while creating the outreach script.");
    }
  };

  const handleRowClick = (companyName) => {
    navigate(`/company/${id}/${encodeURIComponent(companyName)}`);
  };

  const renderTableContent = () => {
    if (Array.isArray(companyData)) {
      return companyData.map((company, index) => (
        <TableRow 
          key={index} 
          className="hover:bg-gray-700 cursor-pointer transition-colors"
          onClick={() => handleRowClick(company.name || `Company${index + 1}`)}
        >
          {Object.entries(company).map(([key, value]) => (
            <TableCell key={key}>{value}</TableCell>
          ))}
        </TableRow>
      ));
    } else if (typeof companyData === 'object') {
      const sortedData = getSortedData();
      return Object.entries(sortedData).map(([website, data], index) => (
        <TableRow 
          key={index} 
          className="hover:bg-gray-700 cursor-pointer transition-colors"
          onClick={() => handleRowClick(website)}
        >
          <TableCell>{website}</TableCell>
          <TableCell>{data.company_info?.n_employees || 'N/A'}</TableCell>
          <TableCell>{data.company_info?.headquarters || 'N/A'}</TableCell>
          <TableCell>{data.company_info?.businesstype || 'N/A'}</TableCell>
          <TableCell>{data.criteria_evaluation?.total_points || 'N/A'}</TableCell>
        </TableRow>
      ));
    }
    return null;
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <Button onClick={handleBack} className="mb-4 bg-orange-500 hover:bg-orange-600 text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Accumulated Companies
        </Button>
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Company Details: {id.replace('.json', '')}</h1>
        <div className="bg-gray-800 rounded-lg overflow-hidden mb-8 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-orange-500">Website</TableHead>
                <TableHead 
                  className="text-orange-500 cursor-pointer hover:text-orange-400 flex items-center"
                  onClick={() => handleSort('employees')}
                >
                  Employees {getSortIcon('employees')}
                </TableHead>
                <TableHead className="text-orange-500">Headquarters</TableHead>
                <TableHead className="text-orange-500">Business Type</TableHead>
                <TableHead 
                  className="text-orange-500 cursor-pointer hover:text-orange-400 flex items-center"
                  onClick={() => handleSort('points')}
                >
                  Total Points {getSortIcon('points')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableContent()}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center">
          {isEnriched ? (
            <Button 
              onClick={handleCreateOutreachScript} 
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-2"
            >
              <Mail className="mr-2 h-4 w-4" />
              Create Outreach Script
            </Button>
          ) : (
            <Button 
              onClick={handleEnrichData} 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
            >
              <Database className="mr-2 h-4 w-4" />
              Enrich Company Data
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;