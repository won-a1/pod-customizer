import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./App.css";

const builds = ["lean", "reg", "athletic", "big"];
const heights = [160, 170, 180, 190, 200];
const weights = [50, 60, 70, 80, 90, 100];

const formThemes = [
  {
    bg: "bg-white",
    border: "border-blue-500",
    btn: "bg-blue-600 hover:bg-blue-700",
  },
  {
    bg: "bg-gray-100",
    border: "border-green-500",
    btn: "bg-green-600 hover:bg-green-700",
  },
  {
    bg: "bg-yellow-50",
    border: "border-yellow-500",
    btn: "bg-yellow-600 hover:bg-yellow-700",
  },
];

function App() {
  const [formVersion, setFormVersion] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      height: 180,
      weight: 80,
      build: "athletic",
      printText: "",
    },
  });

  // Switch form version with Alt+Q
  useEffect(() => {
    const handler = (e) => {
      if (e.altKey && e.key.toLowerCase() === "q") {
        setFormVersion((v) => (v + 1) % 3);
        reset();
        setUploadedImage(null);
        setPreview(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [reset]);

  // Handle file upload
  const handleFile = (file) => {
    setUploadedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Drag and drop
  const dropRef = useRef();
  useEffect(() => {
    const drop = dropRef.current;
    if (!drop) return;
    const prevent = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    drop.addEventListener("dragover", prevent);
    drop.addEventListener("drop", (e) => {
      prevent(e);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    });
    return () => {
      drop.removeEventListener("dragover", prevent);
      drop.removeEventListener("drop", prevent);
    };
  }, []);

  // Print text, max 3 lines
  const printText = watch("printText") || "";
  const lines = printText.split("\n").slice(0, 3);

  const onSubmit = (data) => {
    alert("Form submitted!\n" + JSON.stringify(data, null, 2));
  };

  const theme = formThemes[formVersion];

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex flex-col md:flex-row gap-8 p-6 rounded-lg shadow-lg ${theme.border} border-2 w-full max-w-4xl`}
        style={{ minHeight: 480 }}
      >
        {/* T-shirt Preview */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-64 h-72 mx-auto">
            {/* T-shirt base (placeholder SVG) */}
            <svg viewBox="0 0 256 288" className="absolute w-full h-full">
              <rect x="40" y="60" width="176" height="180" rx="40" fill="#f3f4f6" stroke="#888" strokeWidth="2" />
              <rect x="40" y="60" width="176" height="60" rx="20" fill="#e5e7eb" />
            </svg>
            {/* Print area */}
            <div
              className="absolute left-[36px] top-[100px] w-[140px] h-[60px] flex items-center justify-center border-2 border-dashed bg-white/80"
              ref={dropRef}
              style={{ zIndex: 2 }}
            >
              {!preview && (
                <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-xs text-gray-400">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) handleFile(e.target.files[0]);
                    }}
                  />
                  <span>Drop an image here<br />or click to upload</span>
                </label>
              )}
              {preview && (
                <img
                  src={preview}
                  alt="Print"
                  className="object-contain max-h-full max-w-full"
                  style={{ pointerEvents: "none" }}
                />
              )}
            </div>
            {/* Print text */}
            <div
              className="absolute left-[36px] top-[165px] w-[140px] h-[40px] flex flex-col items-center justify-center"
              style={{ zIndex: 3, pointerEvents: "none" }}
            >
              {lines.map((line, i) => (
                <span
                  key={i}
                  className="block w-full text-center text-gray-700 font-semibold"
                  style={{ fontSize: "14px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                >
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col gap-6 justify-center">
          {/* Height, Weight, Build */}
          <div className="flex gap-2">
            <select
              {...register("height")}
              className={`border rounded px-2 py-1 ${theme.border} focus:outline-none`}
              defaultValue={180}
            >
              {heights.map((h) => (
                <option key={h} value={h}>{h}cm</option>
              ))}
            </select>
            <select
              {...register("weight")}
              className={`border rounded px-2 py-1 ${theme.border} focus:outline-none`}
              defaultValue={80}
            >
              {weights.map((w) => (
                <option key={w} value={w}>{w}kg</option>
              ))}
            </select>
            <select
              {...register("build")}
              className={`border rounded px-2 py-1 ${theme.border} focus:outline-none`}
              defaultValue="athletic"
            >
              {builds.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Print Text */}
          <textarea
            {...register("printText", { maxLength: 120 })}
            rows={3}
            maxLength={120}
            placeholder="Type text to print on t-shirt (max 3 lines)"
            className="border rounded p-2 w-full resize-none focus:outline-none"
            style={{ fontSize: "14px" }}
          />

          {/* Form Version */}
          <div className="text-sm text-gray-500">
            <b>Form Version:</b> {formVersion + 1} (Press <kbd>Alt</kbd> + <kbd>Q</kbd> to switch)
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`text-white px-4 py-2 rounded ${theme.btn}`}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
