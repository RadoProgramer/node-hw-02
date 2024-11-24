const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Import bcryptjs
const gravatar = require("gravatar"); // Import gravatar

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"], // Weryfikacja emaila
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"], // Minimalna długość hasła
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    default: function () {
      return gravatar.url(this.email, { s: "250", d: "retro" }, true);
    },
  },
});

// Metoda do ustawienia hasła (haszowanie)
userSchema.methods.setPassword = async function (password) {
  this.password = await bcrypt.hash(password, 10);
};

// Metoda do weryfikacji hasła
userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;