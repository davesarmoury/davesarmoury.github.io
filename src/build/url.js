const getParamsToString = (getParams) =>
    getParams.map((pair) => pair.join('=')).join('&')

module.exports = {
  getParamsToString,
};
