"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

var BASE_URL = `http://127.0.0.1:8000`;
export function SpellCheckPage() {
  const [text, setText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileResult, setFileResult] = useState("");
  const handleTextChange = (e) => {
    setText(e.target.value);
  };
  const handleSpellCheck = async () => {
    setIsLoading(true);
    try {
      fetch(`${BASE_URL}/spellcheck`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      }).then(async (response) => {
        const parsedResponse = await response.json();
        setIsLoading(false);
        setCorrectedText(parsedResponse.corrected_text);
      });
    } catch (error) {
      console.error("Error checking spelling:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleFileDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };
  // const handleFileUpload = async () => {
  //   setIsLoading(true);
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 3000));
  //     setFileResult("This is the result of the file upload.");
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    debugger;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const text = await blob.text();

      // Optionally, if you still want to provide a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "corrected_text.txt";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      setFileResult(text);
    } catch (error) {
      console.error("Error uploading file:", error);
      setFileResult("Error uploading file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <header className="py-12 md:py-20 bg-primary">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
            Spell Checker
          </h1>
          <p className="max-w-[700px] mx-auto mt-4 text-primary-foreground md:text-xl">
            Catch those pesky typos and misspellings with our powerful spell
            checking tool. Simply paste your text and let us do the rest.
          </p>
        </div>
      </header>
      <main className="container px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-2xl mx-auto space-y-6">
          <Textarea
            className="w-full p-4 rounded-md border border-input bg-background text-foreground"
            placeholder="Enter your text here..."
            rows={8}
            value={text}
            onChange={handleTextChange}
          />
          <div className="relative">
            <Button className="w-full" onClick={handleSpellCheck}>
              {isLoading ? `Checking Spelling...` : `Check Spelling`}
            </Button>
          </div>
          {correctedText && (
            <div className="bg-card p-4 rounded-md">
              <h2 className="text-lg font-medium mb-2">Corrected Text:</h2>
              <p>{correctedText}</p>
            </div>
          )}
        </div>
      </main>
      <div className="container px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-2xl mx-auto space-y-6">
          <div
            className="border-2 border-dashed border-input rounded-md p-8 flex flex-col items-center justify-center cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            {file ? (
              <p className="text-muted-foreground">
                File Added {" "}
                <label
                  htmlFor="file-upload"
                  className="text-primary underline cursor-pointer"
                >
                  {file.name}
                </label>
              </p>
            ) : (
              <>
                <UploadIcon className="w-8 h-8 mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Drag and drop a file here or{" "}
                  <label
                    htmlFor="file-upload"
                    className="text-primary underline cursor-pointer"
                  >
                    click to upload
                  </label>
                </p>
              </>
            )}
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div className="relative">
            <Button className="w-full" onClick={handleFileUpload}>
              {isLoading ? `Uploading ...` : `Upload File`}
            </Button>
          </div>
          {fileResult && (
            <div className="bg-card p-4 rounded-md max-h-[300px] overflow-auto">
              <h2 className="text-lg font-medium mb-2">Corrected Text:</h2>
              <p>{fileResult}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
