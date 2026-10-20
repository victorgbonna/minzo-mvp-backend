const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const AuditLogsSchema = new Schema(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    action:{
        type:String,
        required:true
    },
    targetType: {
        type: String,
        enum: ["User", "Business", "Rating", 'Admin'],
    },
    targetId: {
      type: Schema.Types.ObjectId,
      refPath: "targetType"
    },     
  },
  {
    timestamps: true,
  }
);


const AuditLogs = mongoose.model("AuditLogs", AuditLogsSchema);

module.exports = AuditLogs;



