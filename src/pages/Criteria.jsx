import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import Navbar from '../components/Navbar';

const Criteria = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCompanies = location.state?.selectedCompanies || [];
  const [criteria, setCriteria] = useState([{ name: '', points: 0 }]);

  const handleAddCriteria = () => {
    if (criteria.length < 7) {
      setCriteria([...criteria, { name: '', points: 0 }]);
    }
  };

  const handleRemoveCriteria = (index) => {
    if (criteria.length > 1) {
      const newCriteria = criteria.filter((_, i) => i !== index);
      setCriteria(newCriteria);
    }
  };

  const handleCriteriaChange = (index, field, value) => {
    const newCriteria = [...criteria];
    newCriteria[index][field] = value;
    setCriteria(newCriteria);
  };

  const handleSubmit = () => {
    // Here you would typically send the criteria and selected companies to your backend
    console.log('Selected companies:', selectedCompanies);
    console.log('Criteria:', criteria);
    // For now, we'll just navigate back to the overview page
    navigate('/overview');
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Set Criteria</h1>
        <Card className="max-w-2xl mx-auto bg-gray-800 border-2 border-orange-500">
          <CardContent className="p-6">
            {criteria.map((criterion, index) => (
              <div key={index} className="flex items-center space-x-4 mb-4">
                <Input
                  placeholder="Criterion name"
                  value={criterion.name}
                  onChange={(e) => handleCriteriaChange(index, 'name', e.target.value)}
                  className="flex-grow bg-gray-700 text-white border-orange-300"
                />
                <Input
                  type="number"
                  placeholder="Points"
                  value={criterion.points}
                  onChange={(e) => handleCriteriaChange(index, 'points', parseInt(e.target.value) || 0)}
                  className="w-24 bg-gray-700 text-white border-orange-300"
                />
                {criteria.length > 1 && (
                  <Button onClick={() => handleRemoveCriteria(index)} variant="ghost" className="text-orange-500 hover:text-orange-600">
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {criteria.length < 7 && (
              <Button onClick={handleAddCriteria} variant="outline" className="mt-4 text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white">
                <Plus className="h-4 w-4 mr-2" /> Add Criterion
              </Button>
            )}
            <Button onClick={handleSubmit} className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white">
              Submit Criteria
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Criteria;