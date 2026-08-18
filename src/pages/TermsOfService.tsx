
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 py-12 px-4 md:px-8">
      <SEO
        title="Terms of Service | ErasMatch"
        description="The terms and conditions for using ErasMatch, the platform that connects Erasmus exchange students worldwide."
        path="/terms"
      />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-10">

        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-8 gradient-text">Terms of Service</h1>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Summary</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            ErasMatch is a free platform that helps Erasmus and exchange students find and connect with others heading to the same city or university. By using ErasMatch, you agree to be respectful, keep your info accurate, and follow these terms. We may show links to third-party services (including affiliate partners), and those have their own terms. You can delete your account anytime.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Agreement to Terms</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            By accessing or using ErasMatch ("we", "us", or "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. These terms apply to all visitors, users, and anyone who accesses or uses ErasMatch.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Eligibility</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            To use ErasMatch, you must:
          </p>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2">
            <li>Be at least 16 years old</li>
            <li>Be currently enrolled in, or planning to enroll in, an Erasmus or other study-abroad/exchange program</li>
            <li>Provide accurate and truthful information when creating your account</li>
          </ul>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            If we discover that a user does not meet these requirements, we may suspend or terminate their account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Your Account</h2>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2">
            <li>You are responsible for keeping your login credentials secure. Do not share your password with anyone.</li>
            <li>You must provide accurate and up-to-date information in your profile.</li>
            <li>Each person may only create and maintain one account.</li>
            <li>You are responsible for all activity that occurs under your account.</li>
            <li>If you suspect unauthorized access to your account, contact us immediately at <a href="mailto:erasmatchbusiness@gmail.com" className="text-blue-600 hover:text-blue-800">erasmatchbusiness@gmail.com</a>.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Acceptable Use</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            We want ErasMatch to be a welcoming and safe space for all students. When using our platform, you agree not to:
          </p>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2">
            <li><strong>Harass, bully, or threaten</strong> other users in any way</li>
            <li><strong>Send spam</strong> or unsolicited promotional messages</li>
            <li><strong>Impersonate</strong> another person, student, or organization</li>
            <li><strong>Post illegal content</strong> or content that violates the rights of others</li>
            <li><strong>Scrape, crawl, or collect data</strong> from the platform using automated means</li>
            <li><strong>Attempt to gain unauthorized access</strong> to other accounts or our systems</li>
            <li><strong>Use the platform for commercial purposes</strong> unrelated to the student exchange experience</li>
            <li><strong>Upload malware, viruses,</strong> or any harmful code</li>
          </ul>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            We reserve the right to remove content and suspend or terminate accounts that violate these rules.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">User Content</h2>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2">
            <li>You retain ownership of any content you post on ErasMatch (such as profile information, messages, and forum posts).</li>
            <li>By posting content, you grant ErasMatch a non-exclusive, worldwide, royalty-free license to display, distribute, and use that content as needed to operate and improve the platform.</li>
            <li>We may review, moderate, or remove content that violates these terms or our community guidelines.</li>
            <li>You are solely responsible for the content you post and must ensure it does not infringe on anyone else's rights.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Messaging & Communication</h2>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2">
            <li><strong>Direct messages</strong> are private between the sender and the receiver.</li>
            <li><strong>Group and city chats</strong> are visible to all members of that group or city.</li>
            <li>Platform administrators may access messages and user content for the purposes of safety, moderation, and responding to reports of abuse or policy violations.</li>
            <li>Content is only reviewed when there is a legitimate reason, such as a user report, safety concern, or investigation of a policy violation.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Third-Party Links & Partner Content</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            ErasMatch may display links to third-party websites, products, or services that we think are useful for exchange students. Some of these links may be affiliate or partner links, meaning ErasMatch may earn a commission if you make a purchase or sign up through them.
          </p>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2">
            <li>Third-party services have their own terms of service and privacy policies, which you should review before using them.</li>
            <li>ErasMatch does not control and is not responsible for the content, practices, or availability of any third-party services.</li>
            <li>The inclusion of any link or partner content does not imply endorsement or guarantee by ErasMatch.</li>
            <li>Any transactions or interactions you have with third-party services are solely between you and that third party.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Intellectual Property</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            The ErasMatch name, logo, design, and underlying code are the property of ErasMatch and are protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works based on our branding or platform without our written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Privacy</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            Your privacy matters to us. Please review our <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link> to understand how we collect, use, and protect your personal data. By using ErasMatch, you also agree to our Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Disclaimer of Warranties</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            ErasMatch is provided on an "as is" and "as available" basis. We do our best to keep the platform running smoothly, but we make no guarantees regarding:
          </p>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2">
            <li>Uninterrupted or error-free operation of the platform</li>
            <li>The accuracy, reliability, or completeness of any information provided by users</li>
            <li>The quality or suitability of connections made through the platform</li>
          </ul>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            To the fullest extent permitted by law, we disclaim all warranties, express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Limitation of Liability</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            To the fullest extent permitted by applicable law, ErasMatch and its operator shall not be liable for:
          </p>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2">
            <li>Any indirect, incidental, special, or consequential damages arising from your use of the platform</li>
            <li>Any interactions, disputes, or issues between users</li>
            <li>Any loss or damage resulting from your use of third-party services linked from ErasMatch</li>
            <li>Any unauthorized access to or alteration of your data</li>
          </ul>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            ErasMatch is provided as a free service. Our total liability for any claim related to the service shall not exceed the amount you have paid to us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Termination</h2>
          <ul className="list-disc pl-5 text-sm md:text-base text-gray-600 space-y-2">
            <li>We may suspend or terminate your account at any time if you violate these terms, engage in harmful behavior, or for any reason at our discretion, with or without notice.</li>
            <li>You may delete your account at any time through your profile settings. Upon deletion, your data will be handled in accordance with our <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>.</li>
            <li>Sections of these terms that by their nature should survive termination (such as intellectual property, limitation of liability, and governing law) will continue to apply after your account is terminated.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Changes to These Terms</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            We may update these Terms of Service from time to time. If we make significant changes, we will notify users via email or a prominent notice on the platform. Continued use of ErasMatch after changes are posted constitutes your acceptance of the updated terms. We encourage you to review the terms periodically.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Governing Law</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            These Terms of Service are governed by and construed in accordance with the laws of Ireland. Any disputes arising from these terms or your use of ErasMatch shall be subject to the exclusive jurisdiction of the courts of Ireland.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3">Contact</h2>
          <p className="text-sm md:text-base text-gray-600">
            If you have any questions about these Terms of Service, please contact us at:
            <a href="mailto:erasmatchbusiness@gmail.com" className="text-blue-600 hover:text-blue-800 ml-1">erasmatchbusiness@gmail.com</a>
          </p>
        </section>

        <div className="text-center mt-10 text-sm text-gray-500">
          <p>Last updated: August 18, 2026</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
