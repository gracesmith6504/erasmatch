

# University Data: Answering Your Questions and Proposed Plan

## Your Questions Answered

### "Can you add more universities to my table?"
Yes. There are currently **277 universities** in the table, and **39 universities** referenced by profiles that don't exist in the table yet. I can add all 39 missing ones automatically — no manual work needed from you.

### "Should we add `university_id` to profiles?"
**Not yet.** Here's why:

- **What it does:** Replaces the free-text `profiles.university` column with a numeric foreign key pointing to `universities.id`. This prevents typos, ensures consistency, and makes joins faster.
- **The cost right now:** Every piece of code that reads/writes `profiles.university` (onboarding, profile form, student cards, group messages, filters) would need to be rewritten to use an ID and look up names. That's a large, risky refactor.
- **What you already have working:** The alias system + data cleanup migrations are handling the consistency problem well enough for your current scale (~500 profiles, ~280 universities).
- **Recommendation:** Do this later when you have 1000+ users and the text inconsistencies become a real maintenance burden. For now, keep the text field and focus on keeping the data clean at write-time.

### "Should I start the universities table from scratch?"
**No.** Your current table is in good shape after the cleanup migrations. Starting over would break the `university_aliases` foreign keys and lose the enrichment data (overview, tips, accommodation info) you've added to some entries.

### "What about local vs English names and abbreviations?"
The `university_aliases` table already handles this. The canonical name in `universities.name` should be the **most commonly used English name**, and local names / abbreviations go into `university_aliases`. For example:
- `universities.name` = "University College Dublin"
- `university_aliases`: "UCD", "An Coláiste Ollscoile, Baile Átha Cliath"

No schema change needed — just more alias data.

---

## Proposed Implementation

### Step 1: Add the 39 missing universities
Insert the universities that profiles reference but don't exist in the table. I'll use the city data from profiles where available, and infer it from the university name where obvious.

Examples:
| University | City (from profile or inferred) |
|---|---|
| University of Malta | Msida |
| Universidad Autónoma de Madrid (UAM) | Madrid |
| Scuola Superiore Sant'Anna | Pisa |
| Toulouse Business School | Toulouse |
| Chinese University of Hong Kong | Hong Kong |
| Dalhousie University | Halifax |

### Step 2: Add aliases for the new entries
For universities with abbreviations in their profile name (like "UAM", "UFP", "UVa"), add corresponding alias entries.

### Step 3: Normalize profile text to match canonical names
After adding the universities, update profile text where the casing or format differs slightly (e.g., "Thomas more" → "Thomas More", "tecnocampus university" → "TecnoCampus University").

### Technical Details
- All inserts use the `supabase--insert` tool (data operations, not schema changes)
- No schema changes required
- No code changes required — the search hook already reads from both tables
- Estimated: ~39 university inserts + ~15 alias inserts + ~10 profile text normalizations

