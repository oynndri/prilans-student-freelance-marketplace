export const filterOptions = {
  experienceLevels: [
    { id: "any", label: "Any", count: 2450 },
    { id: "Entry Level", label: "Entry Level", count: 550 },
    { id: "Intermediate", label: "Intermediate", count: 350 },
    { id: "Expert", label: "Expert", count: 250 }
  ],
  projectTypes: ["Hourly", "Fixed Price"],
  budgetRanges: [
    { id: "any", label: "Any", count: 465, min: 0, max: Infinity },
    { id: "under100", label: "Less than $100", count: 216, min: 0, max: 100 },
    { id: "100to500", label: "$100 to $500", count: 193, min: 100, max: 500 },
    { id: "500to1k", label: "$500 to $1K", count: 28, min: 500, max: 1000 },
    { id: "1kto5k", label: "$1K to $5K", count: 20, min: 1000, max: 5000 },
    { id: "5kplus", label: "$5K+", count: 8, min: 5000, max: Infinity }
  ],
  proposalRanges: [
    { id: "under5", label: "Less than 5", min: 0, max: 4, count: 1 },
    { id: "5to10", label: "5 to 10", min: 5, max: 10, count: 8 },
    { id: "10to15", label: "10 to 15", min: 10, max: 15, count: 9 },
    { id: "15to20", label: "15 to 20", min: 15, max: 20, count: 7 }
  ]
};
