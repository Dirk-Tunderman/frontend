import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReplyForm from './ReplyForm';

const fetchEmails = async () => {
  try {
    const response = await fetch('https://newtest1-418220010205.europe-west4.run.app/recieve_email?size=3');
    if (!response.ok) {
      throw new Error('Failed to fetch emails');
    }
    const data = await response.json();
    return data.emails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
};

const InterestLevelIndicator = ({ level, isRelated }) => {
  if (!isRelated) {
    return <Badge variant="outline" className="bg-gray-100 text-gray-500">Email is not related to the campaign</Badge>;
  }

  const colors = {
    low: 'bg-blue-300 text-blue-800',
    medium: 'bg-yellow-300 text-yellow-800',
    high: 'bg-green-300 text-green-800',
  };

  return (
    <Badge className={`${colors[level]} mr-2`}>
      {level.charAt(0).toUpperCase() + level.slice(1)} Interest
    </Badge>
  );
};

const EmailList = ({ fetchEmails: shouldFetchEmails }) => {
  const [expandedEmail, setExpandedEmail] = useState(null);
  const [replyToEmail, setReplyToEmail] = useState(null);
  
  const { data: emails, isLoading, error, refetch } = useQuery({
    queryKey: ['emails'],
    queryFn: fetchEmails,
    enabled: shouldFetchEmails,
  });

  useEffect(() => {
    if (shouldFetchEmails) {
      const intervalId = setInterval(() => {
        refetch();
      }, 15 * 60 * 1000); // 15 minutes in milliseconds

      return () => clearInterval(intervalId);
    }
  }, [shouldFetchEmails, refetch]);

  if (!shouldFetchEmails) return null;
  if (isLoading) return <div className="text-center">Loading emails...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  if (!emails || emails.length === 0) {
    return <div className="text-center">No emails found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Email List</h2>
      <ul className="space-y-2">
        {emails.map((email, index) => (
          <li key={index} className="bg-white shadow rounded-lg p-4">
            <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpandedEmail(expandedEmail === index ? null : index)}>
              <div className="flex items-start flex-grow">
                <Mail className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{email.sender.emailAddress.name}</p>
                    <div className="flex items-center">
                      <InterestLevelIndicator 
                        level={email.analysis_results.level_of_interest} 
                        isRelated={email.analysis_results.is_related}
                      />
                      {email.analysis_results.is_related && (
                        <Badge variant="outline" className="mr-2">Related</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{email.sender.emailAddress.address}</p>
                </div>
              </div>
              {expandedEmail === index ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
            {expandedEmail === index && (
              <div className="mt-4 pl-8">
                <p className="text-sm text-gray-600">To: {email.toRecipients[0].emailAddress.name} ({email.toRecipients[0].emailAddress.address})</p>
                <p className="mt-2">{email.bodyPreview}</p>
                <Button 
                  className="mt-4" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setReplyToEmail(email);
                  }}
                >
                  Reply
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {replyToEmail && (
        <ReplyForm 
          email={replyToEmail} 
          onClose={() => setReplyToEmail(null)}
        />
      )}
    </div>
  );
};

export default EmailList;