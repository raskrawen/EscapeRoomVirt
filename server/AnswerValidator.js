class AnswerValidator {
  constructor() {
    // Shared bypass password for all tasks (server-side only).
    this.masterPassword = '123qwe';
    this.taskAnswers = new Map([
      ['task1', ['ninjanisse']],
      ['task2', ['42']],
      ['task3', ['sulfat']],
      ['task4', ['fiskeguf']],
      ['task5', ['mangan']],
      ['task6', ['kryolit']]
    ]);
  }

  normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  validate(taskKey, answer) {
    const normalizedTaskKey = this.normalize(taskKey);
    const normalizedAnswer = this.normalize(answer);

    if (!normalizedTaskKey || !normalizedAnswer) {
      return false;
    }

    if (normalizedAnswer === this.masterPassword) {
      return true;
    }

    const acceptedAnswers = this.taskAnswers.get(normalizedTaskKey) || [];
    return acceptedAnswers.includes(normalizedAnswer);
  }
}

module.exports = AnswerValidator;