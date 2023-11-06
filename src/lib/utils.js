import { AES } from "crypto-es/lib/aes";
import { Utf8 } from "crypto-es/lib/core";
import { DateTime } from "luxon";
import { PUBLIC_EMOJI_KEY } from "$env/static/public";

import { supabaseClient } from "$lib/supabaseClient";

export async function findEmoji(title) {
  //generate emoji from text
  let title_chunks = title.split(" ");
  let emoji = "⭐";

  for (let i = 0; i < title_chunks.length; i++) {
    let chunk = title_chunks[0];
    let url = `https://emoji-api.com/emojis?search=${chunk}&access_key=${PUBLIC_EMOJI_KEY}`;
    let allEmojis = `https://emoji-api.com/emojis?access_key=${PUBLIC_EMOJI_KEY}`;

    let response = await fetch(url).then((r) => {
      return r.json();
    });

    if (response.status == "error") {
      let allEmojisResponse = await fetch(allEmojis).then((r) => {
        return r.json();
      });
      let randomEmoji =
        allEmojisResponse[parseInt(Math.random() * allEmojisResponse.length)]
          .character;
      emoji = randomEmoji;
    } else {
      emoji = response[0].character;
    }
  }
  return emoji;
}

export function encryptData(data, userId) {
  const encrypted = {
    title: AES.encrypt(data.title, userId).toString(),
    target_count: AES.encrypt(data.target_count.toString(), userId).toString(),
    current_count: AES.encrypt(
      data.current_count.toString(),
      userId,
    ).toString(),
    category: AES.encrypt(data.category, userId).toString(),
    cycle: AES.encrypt(data.cycle, userId).toString(),
    next_update: AES.encrypt(data.next_update, userId).toString(),
    id: data.id,
    created_by: userId,
  };

  return encrypted;
}

export function decryptData(encrypted, userId) {
  const decrypted = {
    title: AES.decrypt(encrypted.title, userId).toString(Utf8),
    target_count: AES.decrypt(encrypted.target_count, userId).toString(Utf8),
    current_count: AES.decrypt(encrypted.current_count, userId).toString(Utf8),
    category: AES.decrypt(encrypted.category, userId).toString(Utf8),
    cycle: AES.decrypt(encrypted.cycle, userId).toString(Utf8),
    next_update: AES.decrypt(encrypted.next_update, userId).toString(Utf8),
    id: encrypted.id,
    created_by: userId,
  };

  return decrypted;
}

export const groupBy = (x, f) =>
  x.reduce((a, b, i) => ((a[f(b, i, x)] ||= []).push(b), a), {});

export async function updateTimesAndReset(data) {
  // check if any of the habits have expired and
  // update their next_update property as well as their
  // current_count resetting to 0

  const now = DateTime.now();
  let needsUpserting = false;

  const updatedData = data.map((h) => {
    const nextUpdateTime = DateTime.fromISO(h.next_update);

    //if we are over the expiring
    //time for this habit

    if (now > nextUpdateTime) {
      needsUpserting = true;

      let updatedTime;
      if (h.cycle == "daily") {
        updatedTime = DateTime.now()
          .plus({ days: 1 })
          .startOf("day")
          .set({ hour: 3 });
      } else {
        updatedTime = DateTime.now()
          .plus({ weeks: 1 })
          .startOf("week")
          .set({ hour: 3 });
      }

      //update time and current count
      h.next_update = updatedTime.toISO();
      h.current_count = 0;
    }
    return h;
  });

  if (needsUpserting) {
    try {
      const { data, error } = await supabaseClient
        .from("habits")
        .upsert(updatedData);
    } catch (error) {
      console.log(error);
    }
    needsUpserting = false;
  }

  return updatedData;
}
