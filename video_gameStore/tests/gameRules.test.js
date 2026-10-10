import test from "node:test";
import assert from "node:assert/strict";
import { gameOptions, calculatePrice, validateGame, getCompatibilityError } from "../shared/gameRules.js";

const game = { title: "Test", image: "/images/BloodRayne.jpeg", genre: "Adventure", setting: "Fantasy", platform: "PC", player_mode: "Single-player", cover_color: "Blue" };

test("all 243 option combinations have consistent validation and integer prices", () => {
  let count = 0;
  for (const genre of gameOptions.genres)
    for (const setting of gameOptions.settings)
      for (const platform of gameOptions.platforms)
        for (const player_mode of gameOptions.playerModes)
          for (const cover_color of gameOptions.coverColors) {
            const value = { ...game, genre, setting, platform, player_mode, cover_color };
            const expected = 2000 + ({Adventure:0,Racing:500,RPG:1000}[genre]) + ({"Single-player":0,"Local co-op":500,Online:1000}[player_mode]);
            assert.equal(calculatePrice(value), expected);
            assert.equal(Boolean(validateGame(value)), platform === "Handheld" && player_mode === "Online");
            assert.equal(validateGame(value), getCompatibilityError(value));
            count++;
          }
  assert.equal(count, 243);
});
test("rejects missing, malformed and blank inputs", () => {
  for (const value of [null, undefined, [], "game", {}, {...game,title:" "}, {...game,title:"a".repeat(256)}, {...game,image:" "}, {...game,image:1}])
    assert.ok(validateGame(value));
});
test("rejects unsupported options", () => {
  for (const field of ["genre","setting","platform","player_mode","cover_color"])
    assert.ok(validateGame({...game,[field]:"Invalid"}));
});
test("valid input allows whitespace trimming and ignores supplied prices", () => {
  assert.equal(validateGame({...game,title:" Test "}), "");
  assert.equal(calculatePrice({...game,total_price:1}), 2000);
});
