# Regression testing

## Automated rules

Run `npm test`. The Node test suite checks all 243 option combinations, expected prices, unsupported options, malformed/blank inputs, and ignoring client-supplied prices.

## Isolated browser sandbox

Run `npm run test:ui`, then open http://127.0.0.1:5175/create.

This runs the real React app against a small in-memory mock API. It does **not** load environment files, connect to PostgreSQL, or modify real games. Restarting the test server restores the two fixture games. Do not use this command for your assignment's database demonstration; use the normal app for that.

Special test titles:

- `FAIL SAVE`: creates/updates return a simulated 500 error.
- `FAIL DELETE`: deletion returns a simulated 500 error.

## Browser checks performed during the refactor

- Whitespace-only title rejected with an inline message.
- Default price $20; RPG + Online price $40.
- Handheld + Online warns early and disables saving; PC restores saving.
- Create failure retains fields and allows retry.
- Successful create navigates to list and shows the new record.
- Edit loads the existing values, including color, platform and player mode.
- Edit failure retains changes and allows a successful retry.
- List deletion: Escape/Cancel leaves the card present and restores focus.
- Simulated deletion failure keeps the card visible with an inline error.
- Successful list deletion removes only the selected fixture.
- Edit deletion returns to the list; deleting the last fixture shows the empty state.
- Missing edit ID displays an error.
- Removed legacy /customgames route displays 404; current navigation uses / and /create.
- Production compilation passed without writing build output.

These tests verify frontend behavior with an isolated API, not current Render availability or live database writes. No real records were created or deleted for this refactor.
