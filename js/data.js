const PALETTE = [
  '#a4243b', '#588b8b', '#d8973c', '#2e4057',
  '#8b5a3c', '#5d737e', '#bc4b51', '#88a09e'
];

const color = d3.scaleOrdinal(PALETTE);

const PRESETS = {
  budget: `// Personal budget — monthly flow
Salary [3000] Take-home
Salary [800] Taxes

Take-home [1200] Living
Take-home [600] Savings
Take-home [800] Discretionary
Take-home [400] Investments

Living [700] Rent
Living [300] Groceries
Living [200] Utilities

Discretionary [350] Eating out
Discretionary [250] Hobbies
Discretionary [200] Travel fund`,

  applications: `// Job application funnel
Applications [60] No response
Applications [40] Response

Response [25] Rejected (screening)
Response [15] Phone screen

Phone screen [8] Rejected (phone)
Phone screen [7] Technical interview

Technical interview [4] Rejected (technical)
Technical interview [3] Final round

Final round [2] Rejected (final)
Final round [1] Offer`
};
