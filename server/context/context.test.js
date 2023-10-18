const request = require("supertest");
const app = require("../../index");
const TestDbHelper = require("../helpers/test.dbhandler");

let concern_id;
let bookingTypeid;

const dbHelper = new TestDbHelper();

beforeAll(async (done) => {
  await dbHelper.start();
  done();
 

  request(app)
    .post("/api/bookingtype")
    .send({
      type: "Chat",
    })
    .end((err, response) => {
      bookingTypeid = response.body._id;
      done(); // save the token!
    });
});

/**
 * Remove and close the db and server.
 */
afterAll(async (done) => {
  await dbHelper.cleanup();
  await dbHelper.stop();
  done();
});

describe("Concern Endpoints", () => {
  it("should create a new concern entry", async (done) => {
    const res = await request(app)
      .post("/api/concern")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        bookingtype: bookingTypeid,
        concern: "Work",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");
    concern_id = res.body._id;
    done();
  });

  it("should fetch a concern details", async (done) => {
    const res = await request(app).get(`/api/concern/${concern_id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("concern");
    expect(res.body).toHaveProperty("bookingtype");
    expect(res.body._id).toEqual(concern_id);
    done();
  });
});
