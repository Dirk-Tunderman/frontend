import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileJson } from "lucide-react";

const Overview = () => {
  const [jsonFiles, setJsonFiles] = useState([]);

  useEffect(() => {
    // In a real application, you would fetch the list of JSON files from your backend
    // For this example, we'll simulate it with some dummy data
    const dummyFiles = [
      { name: 'map1.json', date: '2023-05-01' },
      { name: 'map2.json', date: '2023-05-15' },
      { name: 'map3.json', date: '2023-06-02' },
    ];
    setJsonFiles(dummyFiles);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-blue-600">JSON Maps Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jsonFiles.map((file, index) => (
              <Link to={`/customer-profile/${encodeURIComponent(file.name)}`} key={index}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 flex items-center space-x-4">
                    <FileJson className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">{file.name}</h3>
                      <p className="text-sm text-gray-500">Created: {file.date}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="mt-8 text-center">
        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default Overview;
