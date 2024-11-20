// src/components/FinishedComDashPt2.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Mail, BarChart2, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// SWOT Analysis Component
const SwotAnalysis = ({ swotData }) => (
  <Card className="bg-gray-800 border-orange-500">
    <CardHeader>
      <CardTitle className="text-xl text-orange-500">SWOT Analysis</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-500 mb-2">Strengths</h3>
          <p className="text-sm">{swotData?.Strengths || 'N/A'}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-500 mb-2">Weaknesses</h3>
          <p className="text-sm">{swotData?.Weaknesses || 'N/A'}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-500 mb-2">Opportunities</h3>
          <p className="text-sm">{swotData?.Opportunities || 'N/A'}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-500 mb-2">Threats</h3>
          <p className="text-sm">{swotData?.Threats || 'N/A'}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Industry Analysis Component
const IndustryAnalysis = ({ report }) => (
  <Card className="bg-gray-800 border-orange-500">
    <CardHeader>
      <CardTitle className="text-xl text-orange-500">Industry Analysis</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-4">
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-500 mb-2">Current Performance</h3>
          <p className="text-sm">{report?.current_performance || 'N/A'}</p>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-500 mb-2">Future Outlook</h3>
          <p className="text-sm">{report?.future_outlook_takeaways || 'N/A'}</p>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-500 mb-2">Key Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Average Wage per Employee</p>
              <p className="text-lg font-semibold">
                ${report?.key_stats?.av_wage_p_employee?.toLocaleString() || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Revenue Range</p>
              <p className="text-lg font-semibold">
                ${report?.key_stats?.rev_company?.min?.toLocaleString() || 'N/A'} - 
                ${report?.key_stats?.rev_company?.max?.toLocaleString() || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Recent News Component
const RecentNews = ({ news }) => (
  <Card className="bg-gray-800 border-orange-500">
    <CardHeader>
      <CardTitle className="flex items-center">
        <Newspaper className="mr-2 h-5 w-5" />
        Recent News
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {news?.map((item, index) => (
          <div key={index} className="bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-orange-500">{item.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{item.date || 'Date not specified'}</p>
            <p className="text-sm mt-2">{item.summary}</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Email Preview Component
const EmailPreview = ({ email }) => (
  <Card className="bg-gray-800 border-orange-500">
    <CardHeader>
      <CardTitle className="flex items-center">
        <Mail className="mr-2 h-5 w-5" />
        Generated Email
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <div>
          <span className="font-semibold">To: </span>
          {Array.isArray(email?.email_reciever) 
            ? email?.email_reciever.join(', ') 
            : email?.email_reciever || 'N/A'}
        </div>
        <div>
          <span className="font-semibold">Subject: </span>
          {email?.subjectline || 'N/A'}
        </div>
        <div>
          <span className="font-semibold">Timezone: </span>
          {email?.timezone || 'N/A'}
        </div>
      </div>
      <div className="mt-4 bg-gray-900 p-4 rounded-lg whitespace-pre-wrap">
        {email?.email?.replace(/\\n/g, '\n') || 'No email content available'}
      </div>
    </CardContent>
  </Card>
);

// Advanced Metrics Component
const AdvancedMetrics = ({ company_report = [] }) => (
  <Card className="bg-gray-800 border-orange-500">
    <CardHeader>
      <CardTitle className="flex items-center">
        <TrendingUp className="mr-2 h-5 w-5" />
        Advanced Metrics
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Tabs defaultValue="drivers" className="space-y-4">
        <TabsList className="grid grid-cols-3 gap-4">
          <TabsTrigger value="drivers">Key Drivers</TabsTrigger>
          <TabsTrigger value="trends">Key Trends</TabsTrigger>
          <TabsTrigger value="regulation">Regulation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="drivers" className="space-y-4">
          {company_report[0]?.external_drivers?.map((driver, index) => (
            <div key={index} className="bg-gray-900 p-3 rounded-lg">
              {driver}
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          {company_report[0]?.key_trends?.map((trend, index) => (
            <div key={index} className="bg-gray-900 p-3 rounded-lg">
              {trend}
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="regulation" className="space-y-4">
          <div className="bg-gray-900 p-3 rounded-lg">
            {company_report[0]?.regulation_and_policy || 'No regulation data available'}
          </div>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
);

// Main Secondary Content Component
const FinishedComDashPt2 = ({ companyData }) => {
    console.log('FinishedComDashPt2 received data:', companyData);
    
    const company_report = companyData?.company_info?.company_report || [];
    const swotData = company_report[0]?.SWOT || {};
    const news = companyData?.company_info?.company_info?.recent_news || [];
    const email = companyData?.email || {};
  
    console.log('Processed data:', {
      company_report,
      swotData,
      news,
      email
    });

  return (
    <div className="grid grid-cols-1 gap-8 mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SwotAnalysis swotData={swotData} />
        <IndustryAnalysis report={company_report[0]} />
      </div>
      
      <RecentNews news={news} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EmailPreview email={email} />
      </div>
      
      <AdvancedMetrics company_report={company_report} />
    </div>
  );
};

export default FinishedComDashPt2;