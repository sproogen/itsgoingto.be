import { prop, compose } from 'ramda'

/**
 * Returns a stat from the state
 *
 * @param  {object} state  App state
 * @param  {object} string The stat to select
 *
 * @return {boolean}       The stat
 */
export const statSelector = (state, stat) =>
  compose(
    prop(stat),
    prop('stats')
  )(state)
