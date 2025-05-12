"use client";

import InputCard from "@/components/InputCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useGeneralStore } from "@/stores/general/store";
import { JSX } from "react";
import { CurrentFormFunction } from "@/types";
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from "react-markdown";

type ChatBubbleProps = {
  role: string;
  text: string;
};

const ChatBubble = ({ role, text }: ChatBubbleProps) => {
  const isUser = role === "user";
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} my-1`}
    >
      <div
        className={`max-w-[80%] px-4 py-2 rounded-lg text-black text-sm ${isUser
          ? "bg-primary rounded-br-none"
          : "bg-gray-300 rounded-bl-none"
          }`}
      >
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  );
};

export default function AssistantChat({ setCurrentForm }: CurrentFormFunction): JSX.Element {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const setSplitPage = useGeneralStore((state) => state.setSplitLayout);
  const setShowPortal = useGeneralStore((state) => state.setShowPortal);

  const handleInputClose = () => {
    setCurrentForm(null);
    setShowPortal(false);
    setSplitPage(false);
  };

  return (
    <InputCard
      title="Grocery List Helper"
      onClick={handleInputClose}
      content={
        <div className="flex flex-col w-full stretch px-2 overflow-y-auto max-h-[60vh]">
          {messages.map((message) =>
            message.parts.map((part, i) => {
              if (part.type === "text") {
                return (
                  <ChatBubble
                    key={`${message.id}-${i}`}
                    role={message.role}
                    text={part.text}
                  />
                );
              }
              return null;
            })
          )}
        </div>
      }
      footer={
        <form className="flex flex-row gap-4 items-center justify-center" onSubmit={handleSubmit}>
          <Input
            className="!text-lg h-12 bg-gray-100 text-background"
            placeholder="Lets Talk Food..."
            value={input}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            className="btn-primary rounded-full w-12 h-12 hover:bg-gray-500"
            data-testid="send-button"
          >
            <Icons.send className="!w-8 !h-8" />
          </Button>
        </form>
      }
    />
  );
}
