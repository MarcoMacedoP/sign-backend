const A_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

/**
 *Compare 2 dates and retun their difference in days
 * @param {*} date the Date object to be compared with today.
 * @returns the difference of the dates on days
 */
function compareDateToTodayInDays(date) {
  const today = new Date();
  const diffOnMillis = date - today;
  return Math.floor(diffOnMillis / A_DAY_IN_MILLISECONDS);
}
module.exports = compareDateToTodayInDays;
