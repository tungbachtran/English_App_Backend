const exerciseRoutes = require('./exercise/exercise.route');
const languageRoutes = require('./language/language.route');
const unitRoutes = require('./unit/unit.route');
const lessonRoutes = require('./lesson/lesson.route');
const userRoutes = require('./user/user.route');

module.exports = (app) => {
  app.use('/api/lesson/:lessonId/exercises', exerciseRoutes);
  app.use('/api/languages', languageRoutes);
  app.use('/api/units', unitRoutes);
  app.use('/api/lessons', lessonRoutes);
  app.use('/api/users', userRoutes);
};
