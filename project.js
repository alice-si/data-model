const Mongoose = require('mongoose');
const htmlencode = require('htmlencode');
const ModelUtils = require('./model-utils');

const projectStatuses = ['FINISHED', 'ACTIVE', 'PENDING'];

let ProjectSchema = new Mongoose.Schema({
  code: {type: String, unique: true},
  title: String,
  status: {
    type: String,
    enum: projectStatuses,
    default: 'PENDING'
  },
  lead: String,
  charity: {
    type: Mongoose.Schema.ObjectId,
    ref: 'Charity'
  },
  img: String,
  video: String,

  summary: String,
  project: String,
  serviceProvider: String,
  beneficiary: String,
  validator: String,
  initializerImg: String,
  validatorImg: String,
  costBreakdown: String,

  peopleTarget: Number,
  fundingTarget: Number,
  perPerson: Number,
  externalFunding: Number,
  outcomesIntro: String,
  contractAddress: String,

  myStory: [{
    img: String,
    header: String,
    details: String
  }],
  _outcomes: [{
    type: Mongoose.Schema.ObjectId,
    ref: 'Outcome'
  }],
  _parentId: {
    type: Mongoose.Schema.ObjectId,
    ref: 'Category'
  }
});

const fieldsToDecode = ['lead', 'summary', 'project', 'serviceProvider', 'beneficiary', 'validator', 'costBreakdown', 'outcomesIntro'];

ProjectSchema.methods.htmlFieldsDecode = function () {
  let project = this;
  fieldsToDecode.forEach(function (field) {
    project[field] = htmlencode.htmlDecode(project[field]);
  });
  project.myStory.forEach(function (story) {
    story.header = htmlencode.htmlDecode(story.header);
    story.details = htmlencode.htmlDecode(story.details);
  });
};

function schemaModifier(schema, mongooseInstance) {
  const Outcome = require('./outcome')(mongooseInstance);
  schema.pre('remove', function (next) {
    Outcome.find({_parentId: this._id}).remove(function () {
      console.log("Removing nested outcomes");
    });
    next();
  });
}

module.exports = ModelUtils.exportModel('Project', ProjectSchema, schemaModifier);