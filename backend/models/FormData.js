const mongoose = require("mongoose");

const FormDataSchema = new mongoose.Schema({
  name: { type: String ,required:true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true }
});

const FormDataModel = mongoose.model("FormData", FormDataSchema);

module.exports = FormDataModel;
 