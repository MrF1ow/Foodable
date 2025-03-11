"use client";

import { useGeneralStore } from "@/stores/general/store";
import { useUserStore } from "@/stores/user/store";
import { useState } from "react";
import { useTheme } from "next-themes";

// Card Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Button component
import { Button } from "@/components/ui/button";
import { GeneralAccordion } from "@/components/general-accordion";
import { InputCard } from "@/components/common/input-card/input-card"; // Import your InputCard component
import { Input } from "@/components/ui/input"; // Import the new Input component

export default function Settings() {
  const isMobile = useGeneralStore((state) => state.isMobile);
  const user = useUserStore((state) => state);
  const setEmail = useUserStore((state) => state.setEmail);
  const setUsername = useUserStore((state) => state.setUsername);
  const setPassword = useUserStore((state) => state.setAuthToken); // Set password logic can be added
  const setLanguage = useUserStore((state) => state.setLanguage); // Adding language setting logic

  const [darkMode, setDarkMode] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username);
  const [newEmail, setNewEmail] = useState(user.email);
  const [password, setPasswordInput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(
    user.language || "en"
  ); // Default to English
  const [successMessage, setSuccessMessage] = useState("");
  const { setTheme, resolvedTheme } = useTheme();

  const [isButtonDisabled, setButtonDisabled] = useState(false); // Disable the button after saving

  const handleUsernameChange = (value: string) => {
    setNewUsername(value);
  };

  const handleEmailChange = (value: string) => {
    setNewEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setPasswordInput(value);
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    setLanguage(value);
  };

  // Save changes to user state when submitting
  const handleSaveProfile = () => {
    setUsername(newUsername);
    setEmail(newEmail);
    setSuccessMessage("Profile updated successfully!"); // Show success message

    setButtonDisabled(true); // Disable button to prevent multiple clicks

    // Reset fields after a short delay
    setTimeout(() => {
      setSuccessMessage(""); // Clear the success message
      setButtonDisabled(false); // Re-enable the button
      setNewUsername(newUsername); // Make sure to reset to updated values
      setNewEmail(newEmail);
      setPasswordInput(""); // Clear password field
    }, 2000); // Delay reset by 2 seconds
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Big Wrapper Card */}
      <Card className="flex flex-col p-6 gap-6 shadow-lg">
        {/* Application Settings Section (not in accordion) */}
        <div>
          {/* Theme Settings Card */}
          <Card className="flex flex-col mb-4">
            <CardHeader>
              <CardTitle>Theme</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button
                onClick={() => setTheme("light")}
                variant={resolvedTheme === "light" ? "default" : "outline"} // Highlight light mode button when active
                className={
                  resolvedTheme === "light"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-black"
                }
              >
                Light Mode
              </Button>
              <Button
                onClick={() => setTheme("dark")}
                variant={resolvedTheme === "dark" ? "default" : "outline"} // Highlight dark mode button when active
                className={
                  resolvedTheme === "dark"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }
              >
                Dark Mode
              </Button>
            </CardContent>
          </Card>

          {/* Language Settings Card */}
          <Card className="flex flex-col mb-4">
            <CardHeader>
              <CardTitle>Language</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className={`p-2 border rounded-lg w-full ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
              </select>
            </CardContent>
          </Card>
        </div>

        {/* Account Settings Section */}
        <div>
          {/* Edit Profile Accordion */}
          <GeneralAccordion
            title="Edit Profile"
            content={
              <>
                {/* Username Input Card */}
                <InputCard
                  title="Username"
                  onClick={handleSaveProfile} // You can adjust to trigger the save logic
                  content={
                    <div className="flex flex-col mb-4 w-full">
                      <Input
                        type="text"
                        value={newUsername}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        className="p-2 border rounded-lg w-full"
                        placeholder="Enter new username"
                      />
                    </div>
                  }
                  footer={
                    <div className="text-right">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isButtonDisabled}
                      >
                        Save Changes
                      </Button>
                    </div>
                  }
                />

                {/* Email Input Card */}
                <InputCard
                  title="Email"
                  onClick={handleSaveProfile}
                  content={
                    <div className="flex flex-col mb-4 w-full">
                      <Input
                        type="email"
                        value={newEmail}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        className="p-2 border rounded-lg w-full"
                        placeholder="Enter new email"
                      />
                    </div>
                  }
                  footer={
                    <div className="text-right">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isButtonDisabled}
                      >
                        Save Changes
                      </Button>
                    </div>
                  }
                />

                {/* Password Input Card */}
                <InputCard
                  title="Password"
                  onClick={handleSaveProfile}
                  content={
                    <div className="flex flex-col mb-4 w-full">
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        className="p-2 border rounded-lg w-full"
                        placeholder="New Password"
                      />
                    </div>
                  }
                  footer={
                    <div className="text-right">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isButtonDisabled}
                      >
                        Save Changes
                      </Button>
                    </div>
                  }
                />
              </>
            }
            width={isMobile ? "100%" : "100%"}
            iconSize={40}
            textSize="1.5rem"
          />
        </div>

        {/* More Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">More</h2>
          <p className="text-gray-500 italic">
            About Us: This is a sample settings page.
          </p>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="text-green-500 text-center mt-4">
            {successMessage}
          </div>
        )}
      </Card>
    </div>
  );
}
