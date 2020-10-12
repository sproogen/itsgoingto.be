import { prop, compose, has } from 'ramda'

/**
 * Returns if there is a user object with a token
 *
 * @param  {object} state App state
 *
 * @return {boolean}      Whether a user exits with a token
 */
export const hasUserSelector = (state) => {
  console.log('state', state)
  return compose(
    has('token'),
    prop('user')
  )(state)
}

/**
* Returns the token from the user object
*
* @param  {object} state App state
*
* @return {boolean}      The users token
*/
export const userTokenSelector = (state) => compose(
  prop('token'),
  prop('user')
)(state)
