
import React, { useEffect, useState } from "react";

interface CountryFlagProps {
  country: string | null;
}

const CountryFlag: React.FC<CountryFlagProps> = ({ country }) => {
  const [countryEmoji, setCountryEmoji] = useState<string>("🌍");

  useEffect(() => {
    const getCountryEmoji = () => {
      if (!country) return "🌍";
      if (country === "Spain") return "🇪🇸";
      if (country === "France") return "🇫🇷";
      if (country === "Germany") return "🇩🇪";
      if (country === "Italy") return "🇮🇹";
      if (country === "Netherlands") return "🇳🇱";
      if (country === "Portugal") return "🇵🇹";
      if (country === "Greece") return "🇬🇷";
      if (country === "United Kingdom") return "🇬🇧";
      return "🌍";
    };
    
    setCountryEmoji(getCountryEmoji());
  }, [country]);

  return <span>{countryEmoji}</span>;
};

export default CountryFlag;
