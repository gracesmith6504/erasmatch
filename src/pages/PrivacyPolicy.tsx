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
            <li>Message content (stored anonymously, not tied to real names)</li>
            <li>Activity data (e.g. last active time)</li>
            <li>We do not currently use cookies or tracking technologies</li>
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
            <li>Monitor and ensure reliability and safety</li>
            <li>Prevent fraudulent activities or security breaches</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Who We Share It With</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            We do not sell your personal data. We may share your information with:
          </p>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2">
            <li>Supabase (for authentication, profile, and message storage)</li>
            <li>Resend (for sending email notifications)</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Cookies & Analytics</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            ErasMatch does not currently use cookies or analytics tracking tools. If this changes in the future,
            this policy will be updated accordingly.
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
            We retain your personal information only as long as necessary for the purposes set out in this Privacy Policy.
            You may request deletion of your data at any time by contacting us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Changes to This Policy</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            We may update our Privacy Policy from time to time. Any updates will be posted on this page, and we may notify
            you via email if the changes are significant. We encourage you to review this policy periodically.
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
