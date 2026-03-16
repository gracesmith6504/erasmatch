

## Merge 9 Duplicate University Pairs

### Step 1 — Update profiles (3 SQL statements via insert tool)
- `UPDATE profiles SET university = 'University of Freiburg' WHERE university = 'Albert-Ludwigs-Universität'` (4 profiles)
- `UPDATE profiles SET university = 'University of Valladolid' WHERE university = 'University of Valladolid (UVa)'` (1 profile)
- `UPDATE profiles SET university = 'Lusófona University' WHERE university = 'Universidade Lusofona'` (2 profiles)

### Step 2 — Migrate existing aliases
- Move aliases from delete-IDs to keep-IDs:
  - `UPDATE university_aliases SET university_id = 280 WHERE university_id = 356` (moves "Universidad de Valladolid", "UVa")
  - `UPDATE university_aliases SET university_id = 237 WHERE university_id = 100 AND alias != 'University of Freiburg'` (moves "ALU Freiburg", "Uni Freiburg")
  - `DELETE FROM university_aliases WHERE university_id = 100 AND alias = 'University of Freiburg'` (redundant)

### Step 3 — Add deleted names as new aliases
Insert 9 new aliases so the old names remain searchable:

| Alias | Keep ID |
|---|---|
| Kobenhavns Universitet (University of Copenhagen) | 7 |
| Universität Wien (Institut für Geschichte) | 8 |
| Albert-Ludwigs-Universität | 237 |
| Eberhard-Karls-Universität Tübingen | 238 |
| University of Padua(Padova) | 315 |
| University of Valladolid (UVa) | 280 |
| EDHEC Business School, Lille | 359 |
| Universidade Lusofona | 378 |
| University of Athens | 150 |

### Step 4 — Delete the 9 duplicate universities
Delete IDs: 134, 103, 100, 102, 325, 356, 24, 389, 14

All operations use the **insert tool** (data operations, not schema changes). No code changes needed — profiles store university as a text field matching the `universities.name` column.

