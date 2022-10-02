// ------------------------------------
// Constants
// ------------------------------------
export const POLL_UPDATE = 'POLL_UPDATE'
export const POLLS_SET = 'POLLS_SET'
export const POLL_PAGE_SET = 'POLL_PAGE_SET'
export const POLL_COUNT_SET = 'POLL_COUNT_SET'
export const QUESTION_UPDATE = 'QUESTION_UPDATE'
export const POLLS_PER_PAGE = 10
export const initialPoll = {
  question: '',
  identifier: '',
  multipleChoice: false,
  passphrase: '',
  answers: [],
  userResponses: [],
}
