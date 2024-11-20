//------------COMPANYDASHBOARD.JSX----------------//

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navbar from '../components/Navbar';

const CompanyDashboard = () => {
  const [companyData, setCompanyData] = useState(null);
  const { id, companyName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(`/api/company/${id}`);
        setCompanyData(response.data[companyName]);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, [id, companyName]);

  const handleBack = () => {
    navigate(`/company/${id}`);
  };

  if (!companyData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <Button onClick={handleBack} className="mb-4 bg-orange-500 hover:bg-orange-600 text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Company List
        </Button>
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">{companyName}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gray-800 border-orange-500">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-orange-500">Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white"><span className="font-semibold">Employees:</span> {companyData.company_info.n_employees}</p>
              <p className="text-white"><span className="font-semibold">Headquarters:</span> {companyData.company_info.Headquarters}</p>
              <p className="text-white"><span className="font-semibold">Founded:</span> {companyData.company_info.Founded}</p>
              <p className="text-white"><span className="font-semibold">Company Type:</span> {companyData.company_info.company_type}</p>
              <p className="text-white"><span className="font-semibold">Locations:</span> {companyData.company_info.Locations}</p>
              <p className="text-white"><span className="font-semibold">URL:</span> <a href={companyData.company_info.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{companyData.company_info.url}</a></p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-orange-500">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-orange-500">Company Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white">{companyData.company_info.company_description}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-orange-500">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-orange-500">Services/Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white">{companyData.company_info.service_product_desc}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-orange-500">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-orange-500">Customer Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white">{companyData.company_info.customer_profile}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 bg-gray-800 border-orange-500">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-orange-500">Decision Makers</CardTitle>
          </CardHeader>
          <CardContent>
            {companyData.decision_makers.map((dm, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-700 rounded-lg">
                <h3 className="text-xl font-semibold text-white">{dm.full_name}</h3>
                <p className="text-white"><span className="font-semibold">Position:</span> {dm.decision_maker_position}</p>
                <p className="text-white"><span className="font-semibold">Email:</span> {dm.personal_email || 'N/A'}</p>
                <p className="text-white"><span className="font-semibold">LinkedIn:</span> {dm.personal_linkedin_url ? <a href={dm.personal_linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{dm.personal_linkedin_url}</a> : 'N/A'}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyDashboard;