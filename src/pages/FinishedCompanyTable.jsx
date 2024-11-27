// src/pages/FinishedCompanyTable.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, ArrowUpDown } from "lucide-react";
import Navbar from '../components/Navbar';
import { Check, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";



const FinishedCompanyTable = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [campaignRunning, setCampaignRunning] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  
  const navigate = useNavigate();
  const { filename } = useParams();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        console.log('Fetching data for filename:', filename);
        const response = await axios.get(`/api/finished-company/${filename}`);
        console.log('Raw API Response:', response.data);

        if (!response.data) {
          throw new Error('No data received from the API');
        }

        const transformedData = response.data.map(companyObj => {
          const companyName = Object.keys(companyObj)[0];
          const companyData = companyObj[companyName];
          const info = companyData.company_info?.company_info || {};
          const outreachData = companyData.outreach_data || {};
          
          return {
            name: companyName,
            type: info.company_type || 'N/A',
            size: info.n_employees || info.company_size || 'N/A',
            headquarters: info.headquarters || 'N/A',
            email_found: outreachData.email_dm_found || 0,
            email_sent: outreachData.email_send || 0,
            call_made: outreachData.cold_call_made || 0,
            total_points: info.score || 0
          };
        });

        console.log('Transformed data:', transformedData);
        setCompanies(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching company data:', err);
        setError(`Failed to fetch company data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [filename]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleCallStatusChange = async (companyName, newStatus) => {
    try {
      await axios.post('/api/update-call-status', {
        filename,
        companyName,
        status: newStatus ? 1 : 0
      });
      
      setCompanies(companies.map(company => {
        if (company.name === companyName) {
          return { ...company, call_made: newStatus ? 1 : 0 };
        }
        return company;
      }));
      
      toast.success(`Call status ${newStatus ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error updating call status:', error);
      toast.error('Failed to update call status');
    }
  };

  const getSortedCompanies = () => {
    if (!sortConfig.key) {
      return companies;
    }

    return [...companies].sort((a, b) => {
      if (a[sortConfig.key] === b[sortConfig.key]) {
        return 0;
      }
      
      if (sortConfig.direction === 'ascending') {
        return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1;
      } else {
        return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1;
      }
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 inline" />;
    }
    
    if (sortConfig.direction === 'ascending') {
      return <ArrowUpDown className="ml-2 h-4 w-4 inline text-orange-500" />;
    }
    
    return <ArrowUpDown className="ml-2 h-4 w-4 inline text-orange-500 rotate-180" />;
  };

  const handleBack = () => {
    navigate('/finished-companies');
  };

  const handleRowClick = (companyName) => {
    navigate(`/finished-company-dashboard/${filename}/${encodeURIComponent(companyName)}`);
  };
  
  const handleSendEmails = async () => {
    try {
      setCampaignRunning(true);
      const response = await axios.post('/api/send-emails', { filename, companies });
      toast.success('Email campaign started successfully');
    } catch (error) {
      console.error('Error starting email campaign:', error);
      toast.error('Failed to start email campaign');
    } finally {
      setCampaignRunning(false);
    }
  };

  const handleLinkedInConnect = async () => {
    try {
      setCampaignRunning(true);
      const response = await axios.post('/api/linkedin-connect', { filename, companies });
      toast.success('LinkedIn connection campaign started successfully');
    } catch (error) {
      console.error('Error starting LinkedIn campaign:', error);
      toast.error('Failed to start LinkedIn campaign');
    } finally {
      setCampaignRunning(false);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handleBack} className="bg-orange-500 hover:bg-orange-600 text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Finished Company Lists
          </Button>
          <div className="flex gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white"
                  disabled={campaignRunning}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {campaignRunning ? 'Campaign Running' : 'Send All Emails'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will send out emails to all companies in this list. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSendEmails}>Send Emails</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleLinkedInConnect}
              disabled={campaignRunning}
            >
              LinkedIn Connect
            </Button>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Finished Companies: {filename}</h1>
        
        {companies.length === 0 ? (
          <p className="text-white text-center">No companies found.</p>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden mb-8 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="text-orange-500 cursor-pointer hover:text-orange-400"
                    onClick={() => handleSort('name')}
                  >
                    Company Name {renderSortIcon('name')}
                  </TableHead>
                  <TableHead 
                    className="text-orange-500 cursor-pointer hover:text-orange-400"
                    onClick={() => handleSort('type')}
                  >
                    Business Type {renderSortIcon('type')}
                  </TableHead>
                  <TableHead 
                    className="text-orange-500 cursor-pointer hover:text-orange-400"
                    onClick={() => handleSort('size')}
                  >
                    Size {renderSortIcon('size')}
                  </TableHead>
                  <TableHead 
                    className="text-orange-500 cursor-pointer hover:text-orange-400"
                    onClick={() => handleSort('headquarters')}
                  >
                    Location {renderSortIcon('headquarters')}
                  </TableHead>
                  <TableHead 
                    className="text-orange-500 cursor-pointer hover:text-orange-400"
                    onClick={() => handleSort('total_points')}
                  >
                    Total Points {renderSortIcon('total_points')}
                  </TableHead>
                  <TableHead 
                    className="text-orange-500 cursor-pointer hover:text-orange-400"
                    onClick={() => handleSort('email_found')}
                  >
                    Email Found {renderSortIcon('email_found')}
                  </TableHead>
                  <TableHead 
                    className="text-orange-500 cursor-pointer hover:text-orange-400"
                    onClick={() => handleSort('email_sent')}
                  >
                    Email Sent {renderSortIcon('email_sent')}
                  </TableHead>
                  <TableHead 
                    className="text-orange-500 cursor-pointer hover:text-orange-400"
                    onClick={() => handleSort('call_made')}
                  >
                    Call Made {renderSortIcon('call_made')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getSortedCompanies().map((company, index) => (
                  <TableRow 
                    key={index}
                    className="hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(company.name)}
                  >
                    <TableCell className="text-white">{company.name}</TableCell>
                    <TableCell className="text-white">{company.type}</TableCell>
                    <TableCell className="text-white">{company.size}</TableCell>
                    <TableCell className="text-white">{company.headquarters}</TableCell>
                    <TableCell className="text-white">{company.total_points}</TableCell>
                    <TableCell className="text-white">
                      <div className="flex items-center justify-center">
                        {company.email_found ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="flex items-center justify-center">
                        {company.email_sent ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      <div 
                        className="flex items-center gap-2" 
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Switch
                          checked={company.call_made === 1}
                          onCheckedChange={(checked) => handleCallStatusChange(company.name, checked)}
                          className="data-[state=checked]:bg-orange-500"
                        />
                        <span>{company.call_made === 1 ? 'Yes' : 'No'}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

      </div>
    </div>
  );
};

export default FinishedCompanyTable;