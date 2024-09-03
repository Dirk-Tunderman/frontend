import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";
import Navbar from '../components/Navbar';

const EmailCreation = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [domain, setDomain] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain.toLowerCase()}`;
    setGeneratedEmail(email);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="p-8">
        <Card className="max-w-2xl mx-auto border-2 border-orange-500 bg-black text-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-orange-500">Email Creation</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Generate a professional email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-gray-800 text-white"
                />
              </div>
              <div>
                <Input
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-gray-800 text-white"
                />
              </div>
              <div>
                <Input
                  placeholder="Domain (e.g., company.com)"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-gray-800 text-white"
                />
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                <Mail className="mr-2 h-4 w-4" /> Generate Email
              </Button>
            </form>

            {generatedEmail && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-orange-500">Generated Email:</h2>
                <Card className="bg-gray-800">
                  <CardContent className="p-4">
                    <p className="text-lg font-bold text-white">{generatedEmail}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailCreation;