import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Navbar from '../components/Navbar';

const EmailCreation = () => {
  const [emailTemplates, setEmailTemplates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating fetching email templates from an API
    const dummyTemplates = [
      { id: 1, name: 'Welcome Email', category: 'Onboarding' },
      { id: 2, name: 'Follow-up', category: 'Sales' },
      { id: 3, name: 'Newsletter', category: 'Marketing' },
      { id: 4, name: 'Thank You', category: 'Customer Service' },
      { id: 5, name: 'Product Update', category: 'Product' },
    ];
    setEmailTemplates(dummyTemplates);
  }, []);

  const handleTemplateClick = (templateId) => {
    // Navigate to a new page with the template details
    navigate(`/email-template/${templateId}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Email Templates</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {emailTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="bg-gray-800 border border-orange-300 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleTemplateClick(template.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Mail className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-1">{template.name}</h3>
                <p className="text-sm text-gray-300">{template.category}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2">
            Create New Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailCreation;