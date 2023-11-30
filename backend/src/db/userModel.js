const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    user_id: String,
    data: {},
    Status: {
      type: String,
      enum: ["In-Progress", "Done"],
      default: "In-Progress",
    },
  },
  { timestamps: true }
);

mongoose.model("user", userSchema);
