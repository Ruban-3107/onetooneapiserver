const request = require("supertest");
const app = require("../../index");
const TestDbHelper = require("../helpers/test.dbhandler");

let screen_id;
let screen_name;

const dbHelper = new TestDbHelper();

beforeAll(async (done) => {
    await dbHelper.start();
    done();
  });

/**
 * Remove and close the db and server.
 */
afterAll(async (done) => {
  await dbHelper.cleanup();
  await dbHelper.stop();
  done();
});

describe("Setting Endpoints", () => {
  it("should create a new setting entry for a screen", async (done) => {
    const res = await request(app)
      .post("/api/setting")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        screen: "upcoming",
        display_maps : false,
        reschedule_limits : null,
        reschedule_threshold : 24,
        cancellation_threshold: null,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");
    screen_id = res.body._id;
    screen_name = res.body.screen;
    done();
  });

  it("should fetch a list of settings details", async (done) => {
    const res = await request(app).get("/api/setting");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    done();
});

  it("should fetch a setting entry details", async (done) => {
    const res = await request(app).get(`/api/setting/${screen_name}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body[0]).toHaveProperty("screen");
    expect(res.body[0]).toHaveProperty("reschedule_limits");
    expect(res.body[0]).toHaveProperty("reschedule_threshold");
    expect(res.body[0]).toHaveProperty("cancellation_threshold");
    expect(res.body[0]._id).toEqual(screen_id);
    done();
  });
});
