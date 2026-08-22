import assert from "node:assert/strict";
import { createNotificationPolling } from "../src/lib/notificationPolling.js";

globalThis.window = {
  setInterval: (callback, ms) => setInterval(callback, ms),
  clearInterval: (timer) => clearInterval(timer),
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let calls = 0;
let active = 0;
let maxActive = 0;
let notificationUpdates = 0;
let messageUpdates = 0;
let errors = 0;

const poller = createNotificationPolling({
  intervalMs: 1,
  getUpdates: async () => {
    calls += 1;
    active += 1;
    maxActive = Math.max(maxActive, active);
    await sleep(15);
    active -= 1;
    return { notifications: [{ _id: String(calls) }], messages: [{ _id: String(calls) }] };
  },
  onNotifications: () => { notificationUpdates += 1; },
  onMessages: () => { messageUpdates += 1; },
  onError: () => { errors += 1; },
});

poller.start();
await sleep(65);
poller.stop();
const callsAtStop = calls;
await sleep(30);
assert.equal(calls, callsAtStop, "stop must cancel future polling");
assert.equal(maxActive, 1, "slow requests must never overlap under rapid timer ticks");
assert.ok(calls >= 3, "polling should continue after slow requests complete");
assert.equal(notificationUpdates, calls, "successful notification responses should be applied");
assert.equal(messageUpdates, calls, "successful message responses should be applied");
assert.equal(errors, 0, "successful polling should not report errors");

let failureCalls = 0;
let failureErrors = 0;
const failurePoller = createNotificationPolling({
  intervalMs: 5,
  getUpdates: async () => {
    failureCalls += 1;
    if (failureCalls === 1) throw new Error("simulated network outage");
    return { notifications: [{ _id: "recovered" }], messages: null };
  },
  onNotifications: (rows) => assert.deepEqual(rows, [{ _id: "recovered" }]),
  onMessages: () => assert.fail("failed message stream must preserve existing state"),
  onError: () => { failureErrors += 1; },
});

await failurePoller.refresh();
assert.equal(failureErrors, 1, "network failure must be observable without throwing from the poller");
await failurePoller.refresh();
failurePoller.stop();
assert.equal(failureCalls, 2, "polling must recover on the next refresh after a failure");

console.log(JSON.stringify({ calls, maxActive, notificationUpdates, messageUpdates, failureCalls, failureErrors }));
