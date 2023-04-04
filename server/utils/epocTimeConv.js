const epocTimeConv = (dateString) => {
  const date1 = new Date(dateString.split("/").reverse().join("-"));
  const epochTime = date1.getTime() / 1000;
  return epochTime;
};
module.exports = epocTimeConv;
