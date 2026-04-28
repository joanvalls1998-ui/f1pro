"use client";

const circuits = [
  {
    name: "Bahrain International Circuit",
    city: "Sakhir",
    country: "Bahrain",
    flag: "BH",
    laps: 53,
    length: 5.412,
    firstGP: 2004,
    raceNum: 1,
  },
  {
    name: "Jeddah Corniche Circuit",
    city: "Jeddah",
    country: "Saudi Arabia",
    flag: "SA",
    laps: 50,
    length: 6.174,
    firstGP: 2021,
    raceNum: 2,
  },
  {
    name: "Albert Park Circuit",
    city: "Melbourne",
    country: "Australia",
    flag: "AU",
    laps: 58,
    length: 5.278,
    firstGP: 1996,
    raceNum: 3,
  },
  {
    name: "Shanghai International Circuit",
    city: "Shanghai",
    country: "China",
    flag: "CN",
    laps: 56,
    length: 5.451,
    firstGP: 2004,
    raceNum: 4,
  },
  {
    name: "Suzuka International Racing Course",
    city: "Suzuka",
    country: "Japan",
    flag: "JP",
    laps: 53,
    length: 5.807,
    firstGP: 1987,
    raceNum: 5,
  },
  {
    name: "Miami International Autodrome",
    city: "Miami",
    country: "United States",
    flag: "US",
    laps: 57,
    length: 5.412,
    firstGP: 2022,
    raceNum: 6,
    isNext: true,
  },
  {
    name: "Circuit de Barcelona-Catalunya",
    city: "Barcelona",
    country: "Spain",
    flag: "ES",
    laps: 66,
    length: 4.675,
    firstGP: 1991,
    raceNum: 7,
  },
  {
    name: "Circuit de Monaco",
    city: "Monaco",
    country: "Monaco",
    flag: "MC",
    laps: 78,
    length: 3.337,
    firstGP: 1929,
    raceNum: 8,
  },
  {
    name: "Gilles Villeneuve Circuit",
    city: "Montreal",
    country: "Canada",
    flag: "CA",
    laps: 70,
    length: 4.361,
    firstGP: 1978,
    raceNum: 9,
  },
  {
    name: "Silverstone Circuit",
    city: "Silverstone",
    country: "United Kingdom",
    flag: "GB",
    laps: 52,
    length: 5.891,
    firstGP: 1950,
    raceNum: 10,
  },
  {
    name: "Circuit de Spa-Francorchamps",
    city: "Spa",
    country: "Belgium",
    flag: "BE",
    laps: 44,
    length: 7.004,
    firstGP: 1950,
    raceNum: 11,
  },
  {
    name: "Hungaroring",
    city: "Budapest",
    country: "Hungary",
    flag: "HU",
    laps: 70,
    length: 4.381,
    firstGP: 1986,
    raceNum: 12,
  },
  {
    name: "Zandvoort Circuit",
    city: "Zandvoort",
    country: "Netherlands",
    flag: "NL",
    laps: 72,
    length: 4.259,
    firstGP: 1952,
    raceNum: 13,
  },
  {
    name: "Monza Circuit",
    city: "Monza",
    country: "Italy",
    flag: "IT",
    laps: 53,
    length: 5.793,
    firstGP: 1950,
    raceNum: 14,
  },
  {
    name: "Baku City Circuit",
    city: "Baku",
    country: "Azerbaijan",
    flag: "AZ",
    laps: 51,
    length: 6.003,
    firstGP: 2016,
    raceNum: 15,
  },
  {
    name: "Singapore Marina Bay Street Circuit",
    city: "Singapore",
    country: "Singapore",
    flag: "SG",
    laps: 61,
    length: 4.928,
    firstGP: 2008,
    raceNum: 16,
  },
  {
    name: "Las Vegas Street Circuit",
    city: "Las Vegas",
    country: "United States",
    flag: "US",
    laps: 50,
    length: 6.12,
    firstGP: 2023,
    raceNum: 17,
  },
  {
    name: "Losail International Circuit",
    city: "Losail",
    country: "Qatar",
    flag: "QA",
    laps: 57,
    length: 5.38,
    firstGP: 2021,
    raceNum: 18,
  },
  {
    name: "Yas Marina Circuit",
    city: "Abu Dhabi",
    country: "United Arab Emirates",
    flag: "AE",
    laps: 55,
    length: 5.281,
    firstGP: 2009,
    raceNum: 19,
  },
];

const flagEmoji: Record<string, string> = {
  BH: "🇧🇭", SA: "🇸🇦", AU: "🇦🇺", CN: "🇨🇳", JP: "🇯🇵",
  US: "🇺🇸", ES: "🇪🇸", MC: "🇲🇨", CA: "🇨🇦", GB: "🇬🇧",
  BE: "🇧🇪", HU: "🇭🇺", NL: "🇳🇱", IT: "🇮🇹", AZ: "🇦🇿",
  SG: "🇸🇬", QA: "🇶🇦", AE: "🇦🇪",
};

export default function CircuitsPage() {
  const totalLength = circuits.reduce((sum, c) => sum + c.length, 0);

  return (
    <div className="min-h-full px-4 pt-16 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Circuits</h1>
        <p className="text-[#8e8e93] text-sm">
          19 circuits · {totalLength.toFixed(1)} km totals
        </p>
      </div>

      {/* Circuit Grid */}
      <div className="grid grid-cols-1 gap-3 no-scrollbar pb-4">
        {circuits.map((circuit) => {
          const isNext = circuit.isNext;

          return (
            <div
              key={circuit.raceNum}
              className={`card p-4 flex items-start gap-4 transition-all duration-200 ${
                isNext
                  ? "border-[#00ff94] shadow-[0_0_20px_rgba(0,255,148,0.15)]"
                  : ""
              }`}
            >
              {/* Flag + Race # */}
              <div className="flex flex-col items-center gap-1 min-w-[48px]">
                <span className="text-3xl">{flagEmoji[circuit.flag]}</span>
                <span className="text-xs text-[#636366] font-mono">
                  #{circuit.raceNum}
                </span>
              </div>

              {/* Circuit Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[15px] leading-tight mb-0.5">
                  {circuit.name}
                </p>
                <p className="text-[#8e8e93] text-sm mb-2">
                  {circuit.city}, {circuit.country}
                </p>

                {/* Stats Row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5 text-[#636366]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2L12 22M12 2L8 6M12 2L16 6" />
                    </svg>
                    <span className="text-xs text-[#8e8e93]">
                      <span className="font-mono text-[#00ff94] font-semibold">
                        {circuit.laps}
                      </span>{" "}
                      vols
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5 text-[#636366]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 18h16M4 18v-4a2 2 0 012-2h12a2 2 0 012 2v4M4 18a2 2 0 002 2h12a2 2 0 002-2M9 10h6" />
                    </svg>
                    <span className="text-xs text-[#8e8e93]">
                      <span className="font-mono text-[#00ff94] font-semibold">
                        {circuit.length.toFixed(3)}
                      </span>{" "}
                      km
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: First GP + Next badge */}
              <div className="flex flex-col items-end gap-1.5">
                <div
                  className={`text-xs px-2 py-1 rounded-md ${
                    isNext
                      ? "bg-[#00ff94]/15 text-[#00ff94] font-semibold"
                      : "bg-[#2c2c2e] text-[#636366]"
                  }`}
                >
                  1r GP: {circuit.firstGP}
                </div>
                {isNext && (
                  <span className="pill text-[10px]">PRÒXIM</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
