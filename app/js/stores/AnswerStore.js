var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ZhishiConstants = require('../constants/ZhishiConstants');
var assign = require('object-assign');
import QuestionStore from './QuestionStore.js'
import Common from '../utils/Common.js'


var CHANGE_EVENT = 'change';

var _answers = {}, _top_answers = {};

let loadAnswers = (question_id, answers) => {
  answers = Common.serializeByKey(answers);
  Common.update(_answers, question_id, answers, true)
}

let edit = (question_id, answer_id) => {
  _answers[question_id][answer_id]['status'] = 'editing editor-content'
}

let update = (answer) => {
  Common.update(_answers[answer.question_id], answer.id, answer)
}

/**
 * Delete a question from the store
 */
function destroy(id) {
  delete _user[id];
}


let AnswerStore = assign({}, EventEmitter.prototype, {

  getAnswer: function(question_id, id) {
    return _answers[question_id][id];
  },

  getAnswers: function(question_id){
    return _answers[question_id]
  },

  getTopAnswers: function(){
    return _top_answers
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AnswerStore.dispatchToken = AppDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {

    case ZhishiConstants.QUESTION_UPDATE:
      if (action.data && action.data.answers) {
        loadAnswers(action.data.id, action.data.answers)
      }
      break;

    case ZhishiConstants.ANSWER_EDIT:
      if (action.data) {
        edit(action.data.question_id, action.data.id)
        AnswerStore.emitChange();
      }
      break;

    case ZhishiConstants.ANSWER_UPDATE:
      if (action.data) {
        update(action.data);
      }
      AnswerStore.emitChange();
      break;

    default:
      // nothing for now
  }
});

export default AnswerStore;