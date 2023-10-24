import { AES, enc } from "crypto-js";
import { DateTime } from "luxon";

import { supabaseClient } from "$lib/supabaseClient";

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
    title: AES.decrypt(encrypted.title, userId).toString(enc.Utf8),
    target_count: AES.decrypt(
      encrypted.target_count.toString(),
      userId,
    ).toString(enc.Utf8),
    current_count: AES.decrypt(encrypted.current_count, userId).toString(
      enc.Utf8,
    ),
    category: AES.decrypt(encrypted.category, userId).toString(enc.Utf8),
    cycle: AES.decrypt(encrypted.cycle, userId).toString(enc.Utf8),
    next_update: AES.decrypt(encrypted.next_update, userId).toString(enc.Utf8),
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
