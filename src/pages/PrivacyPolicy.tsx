
import { useEffect } from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-8 gradient-text">Privacy Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Introduction</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            This Privacy Policy explains how ErasMatch ("we", "us", or "our") collects, uses, and shares your 
            information when you use our website and services. By using ErasMatch, you agree to the collection 
            and use of information in accordance with this policy.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Who We Are</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            ErasMatch is a platform designed to connect Erasmus students worldwide for better exchange experiences. 
            Our mission is to facilitate connections between students participating in exchange programs to enhance 
            their educational journey.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">What We Collect</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            We collect several types of information for various purposes:
          </p>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2">
            <li>Personal information (name, email address)</li>
            <li>Profile information (university, course, interests)</li>
            <li>Message content when you communicate with other users</li>
            <li>Usage data and analytics information</li>
            <li>Device information and cookies</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">How We Use Your Data</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2">
            <li>Provide, operate, and maintain our services</li>
            <li>Connect you with other Erasmus students</li>
            <li>Improve and personalize your experience</li>
            <li>Communicate with you about service-related matters</li>
            <li>Monitor and analyze usage patterns</li>
            <li>Prevent fraudulent activities or security breaches</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Who We Share It With</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            We do not sell your personal data. We may share your information with:
          </p>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2">
            <li>Other users (based on your privacy settings and interactions)</li>
            <li>Service providers who help us deliver our services</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Cookies & Analytics</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            We use cookies and similar tracking technologies to track activity on our service and store certain information. 
            These tools help us understand how you use our site and allow us to enhance your experience.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Your Rights (GDPR)</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            Under the General Data Protection Regulation (GDPR), you have the following rights:
          </p>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2">
            <li>Right to access your personal data</li>
            <li>Right to rectify inaccurate personal data</li>
            <li>Right to request deletion of your personal data</li>
            <li>Right to restrict processing of your personal data</li>
            <li>Right to data portability</li>
            <li>Right to object to processing of your personal data</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Data Retention</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. 
            We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, 
            and enforce our policies.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Changes to This Policy</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. 
            You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>
        
        <section className="mb-4">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Contact</h2>
          <p className="text-sm md:text-base text-gray-600">
            If you have any questions about this Privacy Policy, please contact us at:
            <a href="mailto:erasmatchbusiness@gmail.com" className="text-blue-600 hover:text-blue-800 ml-1">erasmatchbusiness@gmail.com</a>
          </p>
        </section>
        
        <div className="text-center mt-10 text-sm text-gray-500">
          <p>Last updated: May 2, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
