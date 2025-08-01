import React, { useState } from "react";
import { Language } from "@mui/icons-material";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  { code: "fr", name: "French", flag: "🇫🇷" },
];

const LanguageSwitcher = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Language Icon Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-9 h-9 rounded-full transition bg-gray-100"
      >
        <Language className="text-gray-800 hover:shadow-lg" sx={{width:"40px",height:"40px"}} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute left-0 mt-3 bg-white border rounded-lg shadow-md w-28 z-10">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
            >
              <span className="mr-2 text-lg">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
