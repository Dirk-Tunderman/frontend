//-------SETLINKEDINCRITERIA--------//

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import axios from 'axios';
import Navbar from '../components/Navbar';

const SetLinkedInCriteria = () => {
  const [criteria, setCriteria] = useState([{ text: '', points: 0 }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { filename } = useParams();

  const addCriterion = () => {
    if (criteria.length < 7) {
      setCriteria([...criteria, { text: '', points: 0 }]);
    } else {
      toast.error('Maximum 7 criteria allowed');
    }
  };

  const updateCriterion = (index, field, value) => {
    const newCriteria = [...criteria];
    newCriteria[index][field] = value;
    setCriteria(newCriteria);
  };

  const removeCriterion = (index) => {
    const newCriteria = criteria.filter((_, i) => i !== index);
    setCriteria(newCriteria);
  };

  const handleSubmit = async () => {
    const validCriteria = criteria.filter(c => c.text && c.points > 0);
    if (validCriteria.length === 0) {
      toast.error('Please add at least one valid criterion');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await axios.post(`/api/process-linkedin-data`, {
        filename: filename,
        criteria: validCriteria
      });
      
      if (response.data && response.data.message === "Processing started") {
        toast.success('LinkedIn data processing started');
        navigate(`/linkedin/${filename}`);
      } else {
        throw new Error('Failed to start processing');
      }
    } catch (error) {
      console.error('Error processing LinkedIn data:', error);
      toast.error('Failed to process LinkedIn data. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Set Criteria for LinkedIn Data: {filename}</h1>
        {criteria.map((criterion, index) => (
          <div key={index} className="mb-4 flex items-center">
            <Input
              placeholder="Enter criterion"
              value={criterion.text}
              onChange={(e) => updateCriterion(index, 'text', e.target.value)}
              className="mr-2 bg-gray-800 text-white"
            />
            <Input
              type="number"
              placeholder="Points"
              value={criterion.points}
              onChange={(e) => updateCriterion(index, 'points', parseInt(e.target.value))}
              className="w-24 mr-2 bg-gray-800 text-white"
            />
            <Button onClick={() => removeCriterion(index)} className="bg-red-500 hover:bg-red-600">
              Remove
            </Button>
          </div>
        ))}
        <Button onClick={addCriterion} className="mb-4 bg-green-500 hover:bg-green-600">
          Add Criterion
        </Button>
        <div className="flex justify-center mt-4">
          <Button 
            onClick={handleSubmit} 
            className="bg-orange-500 hover:bg-orange-600"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Process LinkedIn Data'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SetLinkedInCriteria;