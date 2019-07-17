let count = 0;

export default async (req, res, next) => {
  count++;
  console.log(count);
  return next();
};
