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
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Summary</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            We collect basic info (like your name, email, and university) to help you connect with other Erasmus students. We never sell your data, and we follow GDPR. You’re always in control of your info.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Introduction</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            This Privacy Policy explains how ErasMatch ("we", "us", or "our") collects, uses, and shares your information when you use our website and services. By using ErasMatch, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Who We Are</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            ErasMatch is a platform designed to connect Erasmus students worldwide for better exchange experiences. Our mission is to facilitate connections between students participating in exchange programs to enhance their educational journey.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">What We Collect</h2>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2">
            <li>Name and email address</li>
            <li>University and course details</li>
            <li>Profile information (bio, interests, destination preferences)</li>
            <li>Message content (stored securely and associated with your profile)</li>
            <li>Activity data (e.g. last active time)</li>
            <li>We do not currently use cookies or tracking technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">How We Use Your Data</h2>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2">
            <li>Provide, operate, and maintain our services</li>
            <li>Connect you with other Erasmus students</li>
            <li>Improve and personalize your experience</li>
            <li>Communicate with you about updates and service-related matters</li>
            <li>Ensure the reliability and safety of the platform</li>
            <li>Prevent misuse, fraud, or security breaches</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Legal Basis for Processing</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            We process your personal data based on your consent (e.g. when you create an account or complete your profile) and legitimate interests (e.g. improving the platform or preventing abuse). You may withdraw your consent at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Who We Share It With</h2>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2">
            <li>Supabase (for authentication, profile, and message storage)</li>
            <li>Resend (for sending email notifications)</li>
            <li>Legal authorities when required by law</li>
          </ul>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Our providers act as data processors and are bound by Data Processing Agreements that ensure GDPR compliance.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">International Data Transfers</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            Some of our service providers may process data outside the European Economic Area (EEA). When this occurs, we ensure adequate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Cookies & Analytics</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            ErasMatch does not currently use cookies or analytics tools. If this changes, we will update this policy and request your explicit consent for any non-essential cookies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Your Rights (GDPR)</h2>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Request deletion of your data (“right to be forgotten”)</li>
            <li>Restrict or object to data processing</li>
            <li>Receive a copy of your data in a portable format</li>
          </ul>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            To exercise any of these rights, email us at <a href="mailto:erasmatchbusiness@gmail.com" className="text-blue-600 hover:text-blue-800">erasmatchbusiness@gmail.com</a>. We will respond within 30 days.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Data Retention</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            We retain your data only as long as needed to provide the service and fulfill the purposes outlined in this policy. You may request deletion of your account and data at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Changes to This Policy</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            We may update this Privacy Policy from time to time. Updates will be posted on this page, and we may notify you via email if the changes are significant. We encourage you to review the policy periodically.
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
          <p>Last updated: May 30, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
