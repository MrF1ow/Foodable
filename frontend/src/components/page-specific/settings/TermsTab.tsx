"use client";

import React, { useState } from "react";

export default function TermsAndConditions() {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>

      <div className="space-y-4">
        <p className="text-yellow-700 font-medium bg-yellow-100 p-3 rounded-md border border-yellow-300">
          Please note: These Terms & Conditions are currently under development and may be updated without prior notice.
        </p>

        <p className="text-sm text-gray-500">
          <strong>Effective Date:</strong> March 11, 2025 &nbsp;|&nbsp; <strong>Version:</strong> Draft 0.9
        </p>

        <p>
          Welcome to <strong>Foodable</strong>. These Terms & Conditions (“Terms”) outline the rules and regulations for the use of our platform, which connects users to nutritious, budget-conscious food recommendations. By accessing or using our services, you agree to abide by these Terms in full.
        </p>

        <p>
          If you do not accept these Terms, you may not use the Foodable platform.
        </p>

        <div className="overflow-y-auto max-h-80 p-4 border border-gray-300 rounded-md bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">1. Overview</h2>
          <p>
            Foodable is designed to provide personalized food options based on your preferences and needs. These Terms govern your use of all features, content, and services made available through the platform.
          </p>

          <h2 className="text-xl font-semibold mt-4 mb-2">2. Account Responsibilities</h2>
          <p>
            To access certain features, you may need to register for an account. You are responsible for maintaining the security of your login information and for any activity under your account. You agree to keep your information accurate and up to date.
          </p>

          <h2 className="text-xl font-semibold mt-4 mb-2">3. Updates and Modifications</h2>
          <p>
            These Terms are subject to change as we continue to develop the platform. Any updates will be communicated on this page, and your continued use of the service constitutes acceptance of the revised Terms.
          </p>
        </div>

        <p className="mt-4">
          For questions or concerns regarding these Terms, feel free to contact our team:
        </p>
        <p>
          <strong>Email:</strong> <a href="mailto:flowe@oregonstate.edu" className="text-blue-600 hover:underline">flowe@oregonstate.edu</a>
        </p>

        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-6 gap-4">
          <button
            className={`px-6 py-2 rounded-md text-white ${
              accepted ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={handleAccept}
            disabled={accepted}
          >
            {accepted ? "Terms Accepted" : "Accept Terms"}
          </button>
          {accepted && (
            <p className="text-green-600 font-semibold">
              Thank you. You have accepted the Terms.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
