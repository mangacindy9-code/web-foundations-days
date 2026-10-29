// Starting Data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" }
];

// 1. searchNotes(word)
function searchNotes(word) {
  const searchTerm = word.toLowerCase();
  return notes.filter(note => note.text.toLowerCase().includes(searchTerm));
}

// 2. longestNote()
function longestNote() {
  if (notes.length === 0) return null;
  let longest = notes[0];
  for (let i = 1; i < notes.length; i++) {
    if (notes[i].text.length > longest.text.length) {
      longest = notes[i];
    }
  }
  return longest;
}

// 3. countByCategory()
function countByCategory() {
  const counts = {};
  for (let i = 0; i < notes.length; i++) {
    const cat = notes[i].category;
    counts[cat] = (counts[cat] || 0) + 1;
  }
  return counts;
}

// 4. getSummary()
function getSummary() {
  if (notes.length === 0) return "0 notes.";
  const counts = countByCategory();
  const summaryParts = [];
  
  for (const category in counts) {
    summaryParts.push(`${counts[category]} ${category}`);
  }
  
  const noteWord = notes.length === 1 ? "note" : "notes";
  return `${notes.length} ${noteWord}: ${summaryParts.join(", ")}.`;
}

// 5. isDuplicate(text)
function isDuplicate(text) {
  const normalizedInput = text.trim().toLowerCase();
  return notes.some(note => note.text.trim().toLowerCase() === normalizedInput);
}

// 6. addNote(text, category)
function addNote(text, category) {
  const validCategories = ["personal", "work", "study"];
  const trimmedText = text ? text.trim() : "";

  // Check length (1-200 characters)
  if (trimmedText.length < 1 || trimmedText.length > 200) {
    console.log(`Failed to add note: Text length must be between 1 and 200 characters.`);
    return false;
  }

  // Check valid category
  if (!validCategories.includes(category)) {
    console.log(`Failed to add note: Category "${category}" is invalid. Must be personal, work, or study.`);
    return false;
  }

  // Check duplication
  if (isDuplicate(trimmedText)) {
    console.log(`Failed to add note: A note with the same text already exists.`);
    return false;
  }

  // Generate unique ID and add note
  const newId = notes.length > 0 ? notes[notes.length - 1].id + 1 : 1;
  notes.push({ id: newId, text: trimmedText, category: category });
  console.log(`Successfully added note: "${trimmedText}" (${category})`);
  return true;
}


// ==========================================
// TESTING & CONSOLE LOGGING
// ==========================================

console.log("--- Testing searchNotes ---");
console.log(searchNotes("study")); 
// Expected: [{ id: 2, text: "Finish the Day 3 assignment", category: "study" }, { id: 4, text: "Revise JavaScript arrays", category: "study" }]
console.log(searchNotes("xyz")); 
// Expected: []

console.log("\n--- Testing longestNote ---");
console.log(longestNote()); 
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

// Edge case for empty array
const backupNotes = notes;
notes = [];
console.log(longestNote()); 
// Expected: null
notes = backupNotes; // Restore notes

console.log("\n--- Testing countByCategory ---");
console.log(countByCategory()); 
// Expected: { personal: 2, study: 2, work: 1 } (order of keys may vary)

console.log("\n--- Testing getSummary ---");
console.log(getSummary()); 
// Expected: "5 notes: personal: 2, study: 2, work: 1." (or depending on iteration order)

console.log("\n--- Testing isDuplicate ---");
console.log(isDuplicate("  BUY milk AND bread ")); 
// Expected: true
console.log(isDuplicate("Clean the kitchen")); 
// Expected: false

console.log("\n--- Testing addNote ---");
console.log(addNote("Prepare slides for presentation", "work")); 
// Expected: true (Logs success message)

console.log(addNote("Buy milk and bread", "personal")); 
// Expected: false (Logs duplicate reason)

console.log(addNote("", "personal")); 
// Expected: false (Logs length reason)

console.log(addNote("Valid text note", "fitness")); 
// Expected: false (Logs category reason)
