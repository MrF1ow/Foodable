"use client";

import React, { useState } from "react";

export default function TermsAndConditions() {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Terms and Conditions</h1>

      <div className="space-y-4">
        <p>
          <strong>Last updated:</strong> March 11, 2025 at 4:00 PM
        </p>
        <p>
          Welcome to Foodable! These Terms and Conditions govern your use of the
          Foodable platform (the `&quot;`Service`&quot;`), which helps users discover healthy
          and affordable food options tailored to their dietary and financial
          needs. By accessing or using the Service, you agree to comply with and
          be bound by these Terms and Conditions.
        </p>

        <p>
          If you do not agree with these terms, please do not use the Service.
        </p>

        <div className="overflow-y-auto max-h-80 p-4 border border-gray-300 rounded-md">
          <h3 className="text-xl font-semibold">1. Introduction</h3>
          <p>
            Welcome to Foodable! These Terms and Conditions govern your use of
            the Foodable platform (the `&quot;`Service`&quot;`), which helps users discover
            healthy and affordable food options tailored to their dietary and
            financial needs. By accessing or using the Service, you agree to
            comply with and be bound by these Terms and Conditions.
          </p>

          <h3 className="text-xl font-semibold mt-4">2. User Accounts</h3>
          <p>
            To access certain features of Foodable, you may be required to
            create a user account. You agree to provide accurate, current, and
            complete information during the registration process and to update
            such information to keep it accurate and complete. You are
            responsible for maintaining the confidentiality of your account
            credentials and for all activities that occur under your account.
          </p>
        </div>

        <p className="mt-4">
          If you have any questions about these Terms and Conditions, please
          contact us at:
        </p>
        <p>Email: flowe@oregonstate.edu</p>

        <div className="flex justify-between mt-6">
          <button
            className="px-6 py-2 bg-primary text-white rounded-md"
            onClick={handleAccept}
            disabled={accepted}
          >
            {accepted ? "Accepted" : "Accept Terms"}
          </button>
          {accepted && (
            <p className="text-primary font-semibold">
              You have accepted the Terms.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
